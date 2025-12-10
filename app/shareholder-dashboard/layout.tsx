import { ShareholderLayout } from "@/components/shareholder-layout/ShareholderLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ShareholderLayout>{children}</ShareholderLayout>;
}
