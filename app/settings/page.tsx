"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Bell, Key, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [bizName, setBizName] = useState("Bistro Belle (Downtown)");
  const [email, setEmail] = useState("manager@bistrobelle.com");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage hospitality location profile, notification thresholds, and AI auto-response voice.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Location Profile</span>
            </CardTitle>
            <CardDescription className="text-xs">
              This name and contact information are used in your AI-generated response signatures.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Business / Restaurant Name
              </label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full h-9 rounded-lg bg-card border border-border/80 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                General Manager Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 rounded-lg bg-card border border-border/80 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/60 py-3 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {saved && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  Settings saved successfully
                </span>
              )}
            </span>
            <Button type="submit" size="sm" className="gap-1.5 text-xs">
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
