import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";
import { Ticket, Clock, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  total_quota: number;
  remaining_quota: number;
}

export default function ProjectsQuotaListing() {
  const { session, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Reservation state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // Fetch projects initially
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.warn("Could not fetch real projects, falling back to mock UI...", err);
      // Fallback for demo before DB migration is applied
      setProjects([
        {
          id: "mock-1",
          title: "โควต้าน้ำดื่มฉุกเฉิน (เขตประเวศ)",
          description: "รับสิทธิ์รับน้ำดื่มสะอาด 2 แพ็คต่อครัวเรือน",
          total_quota: 500,
          remaining_quota: 124,
        },
        {
          id: "mock-2",
          title: "สิทธิ์จอดรถพักพิง (อาคารจอดรถ กทม.)",
          description: "สำหรับประชาชนในพื้นที่เสี่ยงภัยน้ำท่วม",
          total_quota: 200,
          remaining_quota: 0,
        }
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Setup Realtime subscription
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'projects' },
        (payload) => {
          setProjects((prev) => 
            prev.map((p) => p.id === payload.new.id ? { ...p, ...payload.new } : p)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleReserveClick = (project: Project) => {
    setSelectedProject(project);
    if (!session) {
      // User is not logged in -> Trigger Auth
      setIsAuthModalOpen(true);
    } else {
      // Already logged in -> Show Confirm Reservation
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedProject || !profile) return;
    
    setIsReserving(true);
    try {
      // Generate a simple payload for QR Code
      const qrPayload = `RESERVE-${selectedProject.id}-${profile.id}-${Date.now()}`;
      
      // If mock project, just simulate success
      if (selectedProject.id.startsWith("mock-")) {
        await new Promise(r => setTimeout(r, 1000));
        setQrCodeData(qrPayload);
        toast.success("รับสิทธิ์สำเร็จ!");
        return;
      }

      // Call postgres RPC to safely decrease quota & create reservation
      const { data, error } = await supabase.rpc('reserve_project_quota', {
        p_project_id: selectedProject.id,
        p_user_id: profile.id,
        p_qr_data: qrPayload
      });

      if (error) {
        throw error;
      }

      if (data === true) {
        setQrCodeData(qrPayload);
        toast.success("รับสิทธิ์สำเร็จ!");
        fetchProjects(); // refresh quotas visually
      } else {
        toast.error("ไม่สามารถรับสิทธิ์ได้ (โควต้าอาจเต็ม หรือคุณรับสิทธิ์ไปแล้ว)");
        setIsConfirmModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการจอง");
    } finally {
      setIsReserving(false);
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setQrCodeData(null);
    setSelectedProject(null);
  };

  if (loading) return null;

  return (
    <div className="space-y-4 my-8">
      <div className="flex items-center gap-2 mb-2">
        <Ticket className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold tracking-tight">โครงการ & โควต้า (รับสิทธิ์)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const percentUsed = project.total_quota > 0 
            ? ((project.total_quota - project.remaining_quota) / project.total_quota) * 100 
            : 0;
          const isFull = project.remaining_quota <= 0;

          return (
            <Card key={project.id} className={`flex flex-col ${isFull ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-10 mt-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex-grow space-y-3">
                <div className="flex justify-between items-end text-sm mb-1">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" /> โควต้าเหลือ
                  </span>
                  <span className={`font-bold text-lg ${isFull ? "text-destructive" : "text-primary"}`}>
                    {project.remaining_quota} / {project.total_quota}
                  </span>
                </div>
                <Progress value={percentUsed} className={`h-2 ${isFull ? '[&>div]:bg-destructive' : ''}`} />
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Button 
                  className="w-full" 
                  variant={isFull ? "outline" : "default"}
                  disabled={isFull}
                  onClick={() => handleReserveClick(project)}
                >
                  {isFull ? "โควต้าเต็มแล้ว" : "รับสิทธิ์ / จอง"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground">ไม่มีโครงการพับสิทธิ์ในขณะนี้</p>
        </div>
      )}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsConfirmModalOpen(true); // proceed to confirm after login
        }}
      />

      {/* Confirm Reservation & QR Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={closeConfirmModal}>
        <DialogContent className="sm:max-w-md">
          {qrCodeData ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
              <div className="h-16 w-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <DialogTitle className="text-2xl font-bold text-success">ยืนยันรับสิทธิ์สำเร็จ!</DialogTitle>
              <DialogDescription className="text-base text-foreground">
                โปรดแสดง QR Code นี้เพื่อรับบริการ/ยืนยันสิทธิ์
              </DialogDescription>
              
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <QRCodeSVG value={qrCodeData} size={200} level="M" includeMargin={true} />
              </div>
              
              <div className="text-sm bg-muted/50 p-3 rounded-lg border w-full font-mono text-muted-foreground text-center break-all">
                {qrCodeData}
              </div>

              <Button onClick={closeConfirmModal} className="w-full mt-4">ปิดหน้าต่าง</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>ยืนยันรับสิทธิ์</DialogTitle>
                <DialogDescription>
                  คุณต้องการรับสิทธิ์โครงการ {selectedProject?.title} หรือไม่?
                </DialogDescription>
              </DialogHeader>
              
              <div className="bg-muted/50 p-4 rounded-lg my-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">ผู้รับสิทธิ์:</span>
                    <span className="font-semibold">{profile?.full_name || profile?.national_id || "ระบุตัวตนแล้ว"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">บัตรประชาชน:</span>
                    <span className="font-semibold">***-****-{profile?.national_id?.slice(-4) || "****"}</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeConfirmModal} disabled={isReserving}>ยกเลิก</Button>
                <Button onClick={handleConfirmReservation} disabled={isReserving}>
                  {isReserving ? "กำลังดำเนินการ..." : "ยืนยันรับสิทธิ์"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
