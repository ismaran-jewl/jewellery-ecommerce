"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Loader2, Image as ImageIcon, Layout, Box, Sparkles } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";

const DEFAULT_DATA = { title: "", subtitle: "", buttonText: "", buttonLink: "", imageUrl: "", description: "" };

const ContentForm = ({ itemKey, title, description, data = DEFAULT_DATA, onUpdate, isSaving }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => { 
    setLocalData(data); 
  }, [data]);

  return (
    <Card className="border-stone-200/60 shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-stone-50/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-black text-stone-900">{title}</CardTitle>
            <CardDescription className="text-xs text-stone-400 mt-1 font-medium">{description}</CardDescription>
          </div>
          <Button 
              onClick={() => onUpdate(itemKey, localData)} 
              disabled={isSaving}
              size="sm"
              className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg px-4"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Heading Title</Label>
            <Input 
              value={localData.title || ""} 
              onChange={e => setLocalData({...localData, title: e.target.value})}
              placeholder="Main heading text"
              className="border-stone-200 focus:ring-stone-900"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Subtext / Subtitle</Label>
            <Input 
              value={localData.subtitle || ""} 
              onChange={e => setLocalData({...localData, subtitle: e.target.value})}
              placeholder="Secondary text Line"
              className="border-stone-200 focus:ring-stone-900"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Detailed Description</Label>
          <Textarea 
            value={localData.description || ""} 
            onChange={e => setLocalData({...localData, description: e.target.value})}
            placeholder="Detailed paragraphs or secondary info"
            className="min-h-[100px] border-stone-200 focus:ring-stone-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">CTA Button Text</Label>
            <Input value={localData.buttonText || ""} onChange={e => setLocalData({...localData, buttonText: e.target.value})} placeholder="e.g. Shop Now" className="h-9 border-stone-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">CTA Link / URL</Label>
            <Input value={localData.buttonLink || ""} onChange={e => setLocalData({...localData, buttonLink: e.target.value})} placeholder="e.g. /shop" className="h-9 border-stone-200" />
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Media URL</Label>
            <div className="relative">
              <Input value={localData.imageUrl || ""} onChange={e => setLocalData({...localData, imageUrl: e.target.value})} placeholder="Image or Video URL" className="h-9 pr-9 border-stone-200" />
              <ImageIcon className="absolute right-3 top-2.5 w-4 h-4 text-stone-300" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminContentPage() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/content"));
      if (res.ok) {
        const data = await res.json();
        const contentMap = {};
        data.content.forEach(c => { contentMap[c.key] = c; });
        setContent(contentMap);
      }
    } catch { toast.error("Failed to load content settings"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleUpdate = async (key, data) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, ...data }),
      });
      if (res.ok) {
        toast.success(`Content for "${key}" updated successfully`);
        fetchContent();
      } else toast.error("Update failed");
    } catch { toast.error("Network error"); }
    finally { setSaving(prev => ({ ...prev, [key]: false })); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-stone-400">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-sm font-medium">Fetching Storefront Assets...</p>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Storefront Content Manager</h2>
        <p className="text-sm text-stone-500 mt-1">Control the visual identity and messaging across your public pages.</p>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="mb-6 p-1 bg-stone-100/50 rounded-xl inline-flex w-auto border border-stone-200/40">
          <TabsTrigger value="homepage" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">
            <Layout className="w-3.5 h-3.5 mr-2" /> Homepage
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Seasonal & Promo
          </TabsTrigger>
          <TabsTrigger value="global" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 text-xs font-bold uppercase tracking-wider">
            <Box className="w-3.5 h-3.5 mr-2" /> Global Components
          </TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6">
          <ContentForm 
            itemKey="home_hero" 
            title="Main Hero Section" 
            description="The primary banner at the top of the homepage."
            data={content["home_hero"]}
            onUpdate={handleUpdate}
            isSaving={saving["home_hero"]}
          />
          <ContentForm 
            itemKey="home_featured" 
            title="Featured Products Header" 
            description="Messaging displayed above the featured items carousel."
            data={content["home_featured"]}
            onUpdate={handleUpdate}
            isSaving={saving["home_featured"]}
          />
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <ContentForm 
            itemKey="seasonal_banner" 
            title="Seasonal Split Banner" 
            description="The large promotional section on the shop page."
            data={content["seasonal_banner"]}
            onUpdate={handleUpdate}
            isSaving={saving["seasonal_banner"]}
          />
          <ContentForm 
            itemKey="voice_gift" 
            title="Voice Gifting Experience" 
            description="Managing the text for the dedicated voice messaging section."
            data={content["voice_gift"]}
            onUpdate={handleUpdate}
            isSaving={saving["voice_gift"]}
          />
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <ContentForm 
            itemKey="footer_about" 
            title="Footer Brand Story" 
            description="The brief bio displayed in the site footer."
            data={content["footer_about"]}
            onUpdate={handleUpdate}
            isSaving={saving["footer_about"]}
          />
          <ContentForm 
             itemKey="promo_strip" 
             title="Top Bar Announcement" 
             description="Global announcement text shown at the very top of all pages."
             data={content["promo_strip"]}
             onUpdate={handleUpdate}
             isSaving={saving["promo_strip"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
