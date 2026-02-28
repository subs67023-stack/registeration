import RegistrationForm from "@/components/registration-form";
import Logo from "@/components/logo";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Mini Header for mobile/desktop */}
            <header className="bg-white border-b py-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-indigo-200">
                        <Logo width={40} height={40} />
                    </div>
                    <span className="font-black text-2xl text-indigo-900 tracking-tighter">Rotaract</span>
                </div>
                <div className="hidden sm:block">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Registration</span>
                </div>
            </header>

            <main className="flex-1 py-8 px-4 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">Registration Portal</h1>
                        <p className="mt-3 text-gray-500 max-w-lg mx-auto md:text-lg">
                            Join our community. Complete the form below to secure your spot in our upcoming event.
                        </p>
                    </div>
                    <RegistrationForm />
                </div>
            </main>

            <footer className="py-6 border-t text-center text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} Rotaract Club Registration Management System
            </footer>
        </div>
    );
}
