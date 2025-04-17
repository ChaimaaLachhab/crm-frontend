import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Mail, LockKeyhole, AlertCircle } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect } from "react";

const Dashboard = () => {

    
    return (
        <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Bienvenue, </p>
            </div>
        </main>
        <Footer />
        </div>
    );
    }

    export default Dashboard;