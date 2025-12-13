"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";

interface RegisterFormValues {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'shareholder';
}

export default function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
        defaultValues: {
            role: 'shareholder'
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const password = watch("password");

    const onSubmit = async (data: RegisterFormValues) => {
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await authApi.register({
                username: data.username,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
            });
            // Redirect to login after successful registration
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="w-full max-w-md space-y-8">
              

                {/* Registration Card */}
                <Card className="border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600"></div>
                    <CardHeader className="space-y-3 pb-6">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Register to access shareholder announcements and documents
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-700 font-medium">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            {...register("firstName", { required: "First name is required" })}
                                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-red-600">{errors.firstName.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-700 font-medium">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            {...register("lastName", { required: "Last name is required" })}
                                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-red-600">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Username
                                        </div>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="johndoe"
                                            {...register("username", { required: "Username is required" })}
                                            className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                    </div>
                                    {errors.username && (
                                        <p className="text-sm text-red-600">{errors.username.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </div>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="shareholder@example.com"
                                            {...register("email", { 
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-gray-700 font-medium">
                                        Account Type
                                    </Label>
                                    <select
                                        id="role"
                                        {...register("role", { required: true })}
                                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="shareholder">Shareholder</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Password
                                        </div>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            {...register("password", { 
                                                required: "Password is required",
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters"
                                                },
                                                onChange: handlePasswordChange
                                            })}
                                            className="h-12 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password.message}</p>
                                    )}

                                    {/* Password Strength Indicator */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Password strength:</span>
                                            <span className={`font-medium ${
                                                passwordStrength === 0 ? 'text-gray-500' :
                                                passwordStrength === 1 ? 'text-rose-500' :
                                                passwordStrength === 2 ? 'text-amber-500' :
                                                passwordStrength === 3 ? 'text-blue-500' :
                                                'text-emerald-500'
                                            }`}>
                                                {passwordStrength === 0 ? 'None' :
                                                 passwordStrength === 1 ? 'Weak' :
                                                 passwordStrength === 2 ? 'Fair' :
                                                 passwordStrength === 3 ? 'Good' :
                                                 'Strong'}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    passwordStrength === 0 ? 'w-0 bg-gray-300' :
                                                    passwordStrength === 1 ? 'w-1/4 bg-rose-500' :
                                                    passwordStrength === 2 ? 'w-1/2 bg-amber-500' :
                                                    passwordStrength === 3 ? 'w-3/4 bg-blue-500' :
                                                    'w-full bg-emerald-500'
                                                }`}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <div className={`h-2 w-2 rounded-full ${
                                                    passwordStrength >= 1 ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`} />
                                                <span>8+ characters</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className={`h-2 w-2 rounded-full ${
                                                    passwordStrength >= 2 ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`} />
                                                <span>Uppercase</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className={`h-2 w-2 rounded-full ${
                                                    passwordStrength >= 3 ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`} />
                                                <span>Number</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className={`h-2 w-2 rounded-full ${
                                                    passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-gray-300'
                                                }`} />
                                                <span>Special</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Confirm Password
                                        </div>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            {...register("confirmPassword", { 
                                                required: "Please confirm your password",
                                                validate: (value) => value === password || "Passwords do not match"
                                            })}
                                            className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                        <div className="text-center text-sm">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link 
                                    href="/login" 
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>

               
            </div>
        </div>
    );
}