import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertCircle, FileText, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { sendOtp, verifyOtp, updateProfile } = useAuth();
  
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [fullName, setFullName] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error("กรุณากรอกเบอร์มือถือให้ครบถ้วน");
      return;
    }
    if (nationalId.length !== 13) {
      toast.error("กรุณากรอกเลขบัตรประชาชน 13 หลัก");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(phone);
      toast.success("ส่งรหัส OTP แล้ว กรุณาตรวจสอบ SMS");
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message || "ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;

    setLoading(true);
    try {
      const isValid = await verifyOtp(phone, otpCode);
      if (isValid) {
        // Save additional profile details
        await updateProfile({
          national_id: nationalId,
          full_name: fullName
        });
        toast.success("ยืนยันตัวตนสำเร็จ!");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error("รหัส OTP ไม่ถูกต้อง");
      }
    } catch (error: any) {
      toast.error(error.message || "ยืนยันตัวตนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setStep("details");
    setPhone("");
    setNationalId("");
    setFullName("");
    setOtpCode("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {step === "details" ? "ยืนยันตัวตนเพื่อรับสิทธิ์" : "กรอกรหัสยืนยัน (OTP)"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "details" 
              ? "ระบบต้องการตรวจสอบตัวตนของคุณเพื่อป้องกันการสวมสิทธิ์ด้วยเลขบัตรประชาชน" 
              : `กรุณากรอกรหัส 6 หลักที่ส่งไปยังเบอร์ ${phone}`}
          </DialogDescription>
        </DialogHeader>

        {step === "details" ? (
          <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ชื่อ-นามสกุล (ไม่จำเป็น)</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="เช่น สมชาย ใจดี" 
                  className="pl-9"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive">เลขประจำตัวประชาชน 13 หลัก *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  required
                  maxLength={13}
                  placeholder="X-XXXX-XXXXX-XX-X" 
                  className="pl-9"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">เบอร์โทรศัพท์เพื่อรับ OTP *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  required
                  type="tel"
                  placeholder="08X-XXX-XXXX" 
                  className="pl-9"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading || phone.length < 9 || nationalId.length < 13}>
              {loading ? "กำลังดำเนินการ..." : "รับรหัส OTP"}
            </Button>
            
            <div className="text-xs text-muted-foreground mt-4 flex items-start gap-1">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <p>ข้อมูลบัตรประชาชนจะถูกบันทึกเพื่อตรวจสอบสิทธิโครงการต่างๆ และไม่เกี่ยวข้องกับข้อมูลส่วนบุคคลระดับลึก</p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 mt-4 flex flex-col items-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={(value) => setOtpCode(value)}
              disabled={loading}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button type="submit" className="w-full" disabled={loading || otpCode.length < 6}>
              {loading ? "กำลังยืนยัน..." : "ยืนยันรหัส OTP"}
            </Button>

            <Button type="button" variant="ghost" size="sm" onClick={() => setStep("details")} disabled={loading}>
              แก้ไขเบอร์โทรศัพท์
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
