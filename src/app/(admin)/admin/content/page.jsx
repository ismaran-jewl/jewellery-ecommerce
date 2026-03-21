"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Loader2, Image as ImageIcon, Layout, Box, Sparkles, Plus, Trash2, ListOrdered, Mic, Star, QrCode } from "lucide-react";
import { apiUrl } from "@/lib/fetcher";
import { getImageUrl } from "@/lib/utils";

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
            {localData.imageUrl && (
              <div className="mt-2 text-[10px] flex items-center gap-2 text-stone-400 italic">
                <div className="w-8 h-8 rounded border border-stone-100 overflow-hidden bg-stone-50">
                  <img src={getImageUrl(localData.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                </div>
                Quick Preview
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HeroEditor = ({ itemKey, title, description, data = DEFAULT_DATA, onUpdate, isSaving }) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    // Ensure nested structures exist
    const initialData = {
      ...DEFAULT_DATA,
      ...data,
      metadata: {
        accent: "Luxury Voice Gifting",
        slides: [
          { id: 1, title: "The Diamond Solitaire", sub: "A promise that lasts forever.", img: "https://images.unsplash.com/photo-1598560912005-59a09551e474?auto=format&fit=crop&w=1920&q=80" },
          { id: 2, title: "Golden Hour Charms", sub: "24k Craftsmanship in every link.", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1920&q=80" },
        ],
        floatingCards: {
          qrText: "Scan to hear",
          audioId: "Audio ID: 882",
          ratingCount: "9k+ Happy Voices",
          ratingLabel: "100% Artisan Crafted"
        },
        ticker: [
          "Free Gift Wrapping",
          "Voice Notes Included",
          "QR Code Enabled",
          "Luxury Box Included",
          "BIS Hallmarked Gold",
          "Insured Shipping"
        ],
        ...data?.metadata
      }
    };
    setLocalData(initialData);
  }, [data]);

  const updateSlide = (idx, field, value) => {
    const newSlides = [...(localData.metadata?.slides || [])];
    newSlides[idx] = { ...newSlides[idx], [field]: value };
    setLocalData({ ...localData, metadata: { ...localData.metadata, slides: newSlides } });
  };

  const addSlide = () => {
    const newSlide = { id: Date.now(), title: "New Slide", sub: "New Slide Subtext", img: "" };
    setLocalData({ 
      ...localData, 
      metadata: { 
        ...localData.metadata, 
        slides: [...(localData.metadata?.slides || []), newSlide] 
      } 
    });
  };

  const removeSlide = (idx) => {
    const newSlides = (localData.metadata?.slides || []).filter((_, i) => i !== idx);
    setLocalData({ ...localData, metadata: { ...localData.metadata, slides: newSlides } });
  };

  const updateFloating = (field, value) => {
    setLocalData({ 
      ...localData, 
      metadata: { 
        ...localData.metadata, 
        floatingCards: { ...(localData.metadata?.floatingCards || {}), [field]: value } 
      } 
    });
  };

  const updateTicker = (idx, value) => {
    const newTicker = [...(localData.metadata?.ticker || [])];
    newTicker[idx] = value;
    setLocalData({ ...localData, metadata: { ...localData.metadata, ticker: newTicker } });
  };

  const addTickerItem = () => {
    setLocalData({ 
      ...localData, 
      metadata: { 
        ...localData.metadata, 
        ticker: [...(localData.metadata?.ticker || []), "New Highlight"] 
      } 
    });
  };

  const removeTickerItem = (idx) => {
    const newTicker = (localData.metadata?.ticker || []).filter((_, i) => i !== idx);
    setLocalData({ ...localData, metadata: { ...localData.metadata, ticker: newTicker } });
  };

  return (
    <Card className="border-stone-200/60 shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-stone-50/50 pb-4 border-b border-stone-100">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Hero Section Advanced Editor
            </CardTitle>
            <CardDescription className="text-xs text-stone-400 mt-1 font-medium">
              Customize slides, floating cards, and promotional message highlights.
            </CardDescription>
          </div>
          <Button 
              onClick={() => onUpdate(itemKey, localData)} 
              disabled={isSaving}
              size="sm"
              className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg px-4"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            Save Hero Configuration
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-10">
        {/* Main Branding Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <Layout className="w-3 h-3" /> Main Branding & Messaging
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Accent Text (Top Label)</Label>
              <Input 
                value={localData.metadata?.accent || ""} 
                onChange={e => setLocalData({...localData, metadata: {...localData.metadata, accent: e.target.value}})}
                placeholder="e.g. Luxury Voice Gifting"
                className="border-stone-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Hero Headline</Label>
              <Input 
                value={localData.title || ""} 
                onChange={e => setLocalData({...localData, title: e.target.value})}
                placeholder="Main heading"
                className="border-stone-200"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Subtext Description</Label>
              <Textarea 
                value={localData.subtitle || ""} 
                onChange={e => setLocalData({...localData, subtitle: e.target.value})}
                placeholder="Secondary descriptive text"
                className="border-stone-200 min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Primary CTA Text</Label>
              <Input value={localData.buttonText || ""} onChange={e => setLocalData({...localData, buttonText: e.target.value})} className="border-stone-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-stone-400">Primary CTA Link</Label>
              <Input value={localData.buttonLink || ""} onChange={e => setLocalData({...localData, buttonLink: e.target.value})} className="border-stone-200" />
            </div>
          </div>
        </div>

        {/* Slides Section */}
        <div className="space-y-6 pt-4 border-t border-stone-50">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Background Slides
            </h3>
            <Button onClick={addSlide} variant="outline" size="sm" className="text-[10px] h-7 px-3 border-stone-200 hover:bg-stone-50">
              <Plus className="w-3 h-3 mr-1" /> Add Slide
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {(localData.metadata?.slides || []).map((slide, idx) => (
              <div key={slide.id || idx} className="p-4 rounded-xl border border-stone-100 bg-stone-50/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-stone-400">SLIDE {idx + 1}</span>
                  <Button onClick={() => removeSlide(idx)} variant="ghost" size="icon" className="h-6 w-6 text-stone-300 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold text-stone-500">Overlay Title (Static Info)</Label>
                    <Input value={slide.title} onChange={e => updateSlide(idx, "title", e.target.value)} placeholder="Slide title" className="h-8 text-xs bg-white border-stone-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-stone-500">Image URL</Label>
                    <Input value={slide.img} onChange={e => updateSlide(idx, "img", e.target.value)} placeholder="Unsplash or media URL" className="h-8 text-xs bg-white border-stone-200" />
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <Label className="text-[10px] font-bold text-stone-500">Overlay Subtitle</Label>
                    <Input value={slide.sub} onChange={e => updateSlide(idx, "sub", e.target.value)} placeholder="Slide description" className="h-8 text-xs bg-white border-stone-200" />
                  </div>
                  {/* Thumbnail Preview for Slides */}
                  {slide.img && (
                    <div className="md:col-span-3 mt-2 flex items-center gap-3 p-2 rounded-lg bg-white border border-stone-100 w-fit">
                        <div className="w-16 h-10 rounded overflow-hidden bg-stone-50 shadow-inner">
                            <img src={getImageUrl(slide.img)} alt="Slide Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">Live Image Preview</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cards Section */}
        <div className="space-y-6 pt-4 border-t border-stone-50">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <Box className="w-3 h-3" /> Floating Info Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5 p-3 rounded-lg bg-stone-50/50 border border-stone-100">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-3 h-3 text-stone-400" />
                <Label className="text-[10px] uppercase font-black text-stone-400">QR Card Text</Label>
              </div>
              <Input 
                value={localData.metadata?.floatingCards?.qrText || ""} 
                onChange={e => updateFloating("qrText", e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>
            <div className="space-y-1.5 p-3 rounded-lg bg-stone-50/50 border border-stone-100">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-3 h-3 text-stone-400" />
                <Label className="text-[10px] uppercase font-black text-stone-400">Audio ID Label</Label>
              </div>
              <Input 
                value={localData.metadata?.floatingCards?.audioId || ""} 
                onChange={e => updateFloating("audioId", e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>
            <div className="space-y-1.5 p-3 rounded-lg bg-stone-50/50 border border-stone-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-3 h-3 text-stone-400" />
                <Label className="text-[10px] uppercase font-black text-stone-400">Rating Bold Text</Label>
              </div>
              <Input 
                value={localData.metadata?.floatingCards?.ratingCount || ""} 
                onChange={e => updateFloating("ratingCount", e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>
            <div className="space-y-1.5 p-3 rounded-lg bg-stone-50/50 border border-stone-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-3 h-3 text-stone-400 opacity-50" />
                <Label className="text-[10px] uppercase font-black text-stone-400">Rating Sub-label</Label>
              </div>
              <Input 
                value={localData.metadata?.floatingCards?.ratingLabel || ""} 
                onChange={e => updateFloating("ratingLabel", e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>
          </div>
        </div>

        {/* Ticker Section */}
        <div className="space-y-6 pt-4 border-t border-stone-50">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <ListOrdered className="w-3 h-3" /> Bottom Feature Ticker
            </h3>
            <Button onClick={addTickerItem} variant="outline" size="sm" className="text-[10px] h-7 px-3 border-stone-200 hover:bg-stone-50">
              <Plus className="w-3 h-3 mr-1" /> Add Highlight
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(localData.metadata?.ticker || []).map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={item} 
                  onChange={e => updateTicker(idx, e.target.value)}
                  className="h-8 text-xs border-stone-200"
                />
                <Button onClick={() => removeTickerItem(idx)} variant="ghost" size="icon" className="h-8 w-8 text-stone-300 hover:text-red-500 flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
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
          <HeroEditor 
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
