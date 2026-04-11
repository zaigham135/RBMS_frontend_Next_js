import { ProfilePage } from "@/components/common/ProfilePage";
import { AppTopBar } from "@/components/common/AppTopBar";

export default function ManagerAccountPage() {
  return (
    <ProfilePage
      topBar={<AppTopBar title="Profile" searchPlaceholder="Search..." />}
    />
  );
}
