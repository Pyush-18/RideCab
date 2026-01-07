import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Bell, CheckCircle, AlertCircle, Loader } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SettingsPage = ({ darkMode, toggleTheme, cardClasses }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    email: "",
    darkMode: darkMode,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/notifications/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setSettings({
          ...data.settings,
          darkMode: darkMode,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      showMessage("error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("adminToken");
      const { darkMode: _, ...settingsToSave } = settings;

      const response = await fetch(`${API_URL}/notifications/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("success", "Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showMessage("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin text-amber-500" size={32} />   
      </div>
    );
  }

  return (
    <div className="space-y-6">
           
      <div>
                <h2 className="text-3xl font-bold">Settings</h2>     
        <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} mt-1`}>
                    Manage your application settings and preferences      
        </p>
             
      </div>
         
      {message.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
                 
          {message.type === "success" ? (
            <CheckCircle className="shrink-0" size={20} />
          ) : (
            <AlertCircle className="shrink-0" size={20} />
          )}
                    <span className="font-medium">{message.text}</span>   
        </div>
      )}
           
      <Card className={`${cardClasses} p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-amber-900/20" : "bg-amber-100"
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-semibold">Dark Mode</Label>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Toggle dark mode theme
            </p>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleTheme} />
        </div>
      </Card>
      <Card className={`${cardClasses} p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-lg ${
              darkMode ? "bg-purple-900/20" : "bg-purple-100"
            }`}
          >
            <Bell
              className={`w-5 h-5 ${
                darkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </div>
          <h3 className="text-xl font-bold">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div
            className={`flex items-center justify-between p-4 rounded-xl ${
              darkMode ? "bg-slate-800" : "bg-slate-50"
            }`}
          >
            <div>
              <Label className="font-semibold">Email Notifications</Label>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Receive email alerts for new bookings
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div
            className={`flex items-center justify-between p-4 rounded-xl ${
              darkMode ? "bg-slate-800" : "bg-slate-50"
            }`}
          >
            <div>
              <Label className="font-semibold">In-App Booking Alerts</Label>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Get notified in dashboard on new bookings
              </p>
            </div>
            <Switch
              checked={settings.bookingAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, bookingAlerts: checked })
              }
            />
          </div>

          {!settings.emailNotifications && !settings.bookingAlerts && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                darkMode
                  ? "bg-amber-900/20 border-amber-800"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <AlertCircle
                className={`shrink-0 mt-0.5 ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
                size={18}
              />
              <div>
                <p
                  className={`font-semibold text-sm ${
                    darkMode ? "text-amber-300" : "text-amber-800"
                  }`}
                >
                  Warning
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-amber-400" : "text-amber-700"
                  }`}
                >
                  All notifications are disabled. You won't receive alerts for
                  new bookings.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-linear-to-r from-amber-500 to-orange-600 text-white font-bold  py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg"
        >
          {saving ? (
            <>
                <Loader className="animate-spin mr-2" size={18} /> 
                Saving...        
            </>
          ) : (
            <>
                <CheckCircle className="mr-2" size={18} />         
                Save Changes            
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
