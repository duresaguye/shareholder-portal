"use client";

import Link from "next/link";
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
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    type LoginForm = {
        email: string;
        password: string;
        remember?: boolean;
    };

    const { register, handleSubmit } = useForm<LoginForm>();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data: LoginForm) => {
        console.log(data);
        // Handle login logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="w-full max-w-md space-y-8">
               

                {/* Login Card */}
                <Card className="border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"></div>
                    <CardHeader className="space-y-3 pb-6">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Sign in to access shareholder announcements and documents
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-4">
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
                                            {...register("email", { required: true })}
                                            className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                    </div>
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
                                            placeholder="Enter your password"
                                            {...register("password", { required: true })}
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
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <Label htmlFor="remember" className="text-gray-600">
                                        Remember me
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Sign In
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                        <div className="text-center text-sm">
                            <p className="text-gray-600">
                                Need help?{" "}
                                <Link 
                                    href="/support" 
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                >
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                        
                       
                    </CardFooter>
                </Card>

               
                
            </div>
        </div>
    );
}