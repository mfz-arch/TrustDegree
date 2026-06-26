"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ShieldCheck, Loader2, Sparkles, LogOut, Search, GraduationCap, Building, AlertCircle, FileCheck2, Home, CheckCircle2 } from "lucide-react";

type Certificate = {
  certId: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  issuer: string;
  timestamp: string;
};

export default function Page() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "issue" | "verify">("home");

  // Local Storage Data
  const [recentCerts, setRecentCerts] = useState<Certificate[]>([]);

  // Issue States
  const [certId, setCertId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);

  // Verify States
  const [searchCertId, setSearchCertId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<Certificate | null>(null);
  const [verifyError, setVerifyError] = useState("");

  // --- MOCK WALLET CONNECTION ---
  const connectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      // Generate a fake connected wallet address for demonstration
      const randomHex = Math.random().toString(16).substring(2, 10);
      setWalletAddress(`0x71C${randomHex}A1B2C3D4E5F6G7H8I9J0`);
      setIsConnecting(false);
    }, 1000);
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setActiveTab("home");
  };

  // --- LOAD LOCAL STORAGE DATA ---
  useEffect(() => {
    const saved = localStorage.getItem("trustDegree_certs");
    if (saved) {
      const parsed = JSON.parse(saved) as Certificate[];
      // Show only the 6 most recent
      setRecentCerts(parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6));
    }
  }, []);

  // --- ACTIONS ---
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) return alert("Connect wallet first!");
    if (!certId || !studentName || !courseName || !issueDate) return alert("Fill all fields");
    
    setIsIssuing(true);
    
    // Simulate Blockchain Writing Delay
    setTimeout(() => {
      const saved = localStorage.getItem("trustDegree_certs");
      const existingCerts: Certificate[] = saved ? JSON.parse(saved) : [];

      if (existingCerts.find(c => c.certId === certId)) {
        alert("A certificate with this ID already exists!");
        setIsIssuing(false);
        return;
      }

      const newCert: Certificate = {
        certId,
        studentName,
        courseName,
        issueDate,
        issuer: walletAddress,
        timestamp: new Date().toISOString()
      };
      
      const updatedCerts = [...existingCerts, newCert];
      localStorage.setItem("trustDegree_certs", JSON.stringify(updatedCerts));
      
      setRecentCerts(updatedCerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6));

      alert("Certificate officially issued (Mock)!");
      setCertId(""); setStudentName(""); setCourseName(""); setIssueDate("");
      setIsIssuing(false);
    }, 1500);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCertId) return;
    setIsVerifying(true);
    setVerifyResult(null);
    setVerifyError("");

    // Simulate Blockchain Reading Delay
    setTimeout(() => {
      const saved = localStorage.getItem("trustDegree_certs");
      const existingCerts: Certificate[] = saved ? JSON.parse(saved) : [];

      const found = existingCerts.find(c => c.certId === searchCertId);

      if (found) {
        setVerifyResult(found);
      } else {
        setVerifyError("Certificate ID not found on the simulated network.");
      }
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#050b14] text-slate-100 selection:bg-blue-500/30 overflow-hidden relative font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-blue-900/30 bg-[#050b14]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-100 to-blue-400 bg-clip-text text-transparent">
              TrustDegree
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {walletAddress ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                  <span className="text-sm font-mono text-blue-200">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <button onClick={disconnectWallet} className="p-2 text-blue-500/50 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium transition-all"
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                Connect Institution
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-6 pt-2">
          <button onClick={() => setActiveTab("home")} className={`pb-4 px-2 font-medium flex items-center gap-2 transition-colors relative ${activeTab === "home" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"}`}>
            <Home className="w-4 h-4" /> Home
            {activeTab === "home" && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
          </button>
          <button onClick={() => setActiveTab("verify")} className={`pb-4 px-2 font-medium flex items-center gap-2 transition-colors relative ${activeTab === "verify" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"}`}>
            <Search className="w-4 h-4" /> Verify Certificate
            {activeTab === "verify" && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
          </button>
          {walletAddress && (
            <button onClick={() => setActiveTab("issue")} className={`pb-4 px-2 font-medium flex items-center gap-2 transition-colors relative ${activeTab === "issue" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"}`}>
              <Building className="w-4 h-4" /> Issue Certificate (Admin)
              {activeTab === "issue" && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- HOME TAB --- */}
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Anti-Fraud Infrastructure (Prototype)
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                  Verifiable<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Credentials
                  </span>
                </h1>

                <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                  Protecting educational integrity across Africa. TrustDegree simulates issuing tamper-proof certificates that employers can verify in seconds.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab("verify")} className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors flex flex-col items-center gap-2 text-sm text-slate-300">
                    <Search className="w-6 h-6 text-blue-400" /> Verify a Degree
                  </button>
                  <button onClick={() => setActiveTab("issue")} className="py-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl font-medium transition-colors flex flex-col items-center gap-2 text-sm text-blue-400">
                    <Building className="w-6 h-6" /> Institution Portal
                  </button>
                </div>
              </div>

              {/* Right Column: Global Feed */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:pl-10">
                <div className="flex flex-col rounded-3xl bg-[#0a1122] border border-blue-500/20 backdrop-blur-xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-blue-500/20 bg-black/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                      <h3 className="font-semibold text-lg text-blue-100">Live Global Issuances</h3>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {recentCerts.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-sm">No recent certificates issued.</div>
                    ) : (
                      recentCerts.map((cert, idx) => (
                         <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-blue-500/10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border border-blue-300/30">
                              <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-blue-50">{cert.studentName}</p>
                              <p className="text-xs text-blue-400/70">{cert.courseName}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-slate-500 bg-black/50 px-2 py-1 rounded-md">{cert.certId}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* --- VERIFY TAB --- */}
          {activeTab === "verify" && (
            <motion.div key="verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8 pt-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Verify a Certificate</h2>
                <p className="text-slate-400 text-sm">Enter the unique Certificate ID to verify its authenticity.</p>
              </div>

              <form onSubmit={handleVerify} className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-slate-500" />
                <input 
                  type="text" 
                  value={searchCertId} 
                  onChange={(e) => setSearchCertId(e.target.value)} 
                  className="w-full pl-14 pr-32 py-4 bg-[#0a1122] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-lg text-white shadow-xl" 
                  placeholder="e.g. CERT-2026-001" 
                  required
                />
                <button type="submit" disabled={isVerifying} className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                </button>
              </form>

              {/* Verification Results */}
              <AnimatePresence>
                {verifyResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-8 bg-[#0a1122] border-2 border-green-500/30 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <div className="absolute top-0 right-0 p-4">
                      <FileCheck2 className="w-24 h-24 text-green-500/10" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-green-400">Authentic Certificate</h3>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                      <div>
                        <p className="text-sm text-slate-500">Student Name</p>
                        <p className="text-xl font-semibold text-white">{verifyResult.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Program / Course</p>
                        <p className="text-xl font-semibold text-white">{verifyResult.courseName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                         <div>
                          <p className="text-xs text-slate-500">Issue Date</p>
                          <p className="text-sm font-mono text-blue-200">{verifyResult.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Issuing Authority Wallet</p>
                          <p className="text-sm font-mono text-blue-200 break-all">{verifyResult.issuer}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {verifyError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-red-950/30 border border-red-500/30 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-400">Verification Failed</h4>
                      <p className="text-red-300/80 text-sm mt-1">{verifyError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* --- ISSUE TAB --- */}
          {activeTab === "issue" && (
            <motion.div key="issue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto pt-8">
              {!walletAddress ? (
                <div className="text-center p-12 bg-[#0a1122] rounded-3xl border border-white/10">
                  <Building className="w-16 h-16 text-blue-500/50 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Institution Access Only</h2>
                  <p className="text-slate-400 mb-8">Connect your administrative wallet to issue official certificates.</p>
                  <button onClick={connectWallet} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="bg-[#0a1122] border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600" />
                  <h2 className="text-2xl font-bold text-white mb-2">Issue New Certificate</h2>
                  <p className="text-slate-400 text-sm mb-8">Deploy an immutable academic record.</p>
                  
                  <form onSubmit={handleIssueCertificate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Certificate ID (Unique)</label>
                      <input type="text" required value={certId} onChange={(e) => setCertId(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white font-mono" placeholder="CERT-2026-001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Student Full Name</label>
                      <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Program / Course Name</label>
                      <input type="text" required value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white" placeholder="B.Sc Computer Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Issue Date</label>
                      <input type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white" />
                    </div>
                    
                    <button type="submit" disabled={isIssuing} className="w-full mt-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
                      {isIssuing ? <><Loader2 className="w-5 h-5 animate-spin" /> Writing Record...</> : <><Sparkles className="w-5 h-5" /> Issue Certificate</>}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
