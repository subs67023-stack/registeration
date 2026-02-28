import RegistrationForm from "@/components/registration-form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-indigo-900">Registration Portal</h1>
                    <p className="mt-2 text-gray-600">Fill in the details below to register for the event.</p>
                </div>
                <RegistrationForm />
            </div>
        </div>
    );
}
