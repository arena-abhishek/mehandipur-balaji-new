import ProfileInfo from "@/components/Profile/ProfileInfo";
import OrderList from "@/components/Profile/OrderList";
import Breadcrumb from "@/components/Common/Breadcrumb";
import PaymentSuccess from "@/components/Payment Page";

export default function ProfilePage() {



    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <Breadcrumb pageName="Profile Page" />
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            <ProfileInfo />
        </main>
    );
}
