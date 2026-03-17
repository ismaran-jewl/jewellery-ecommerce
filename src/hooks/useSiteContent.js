"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/fetcher";

export function useSiteContent(key) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(apiUrl("/api/admin/content"));
        if (res.ok) {
          const data = await res.json();
          const item = data.content.find(c => c.key === key);
          if (item) setContent(item);
        }
      } catch (err) {
        console.error(`Failed to fetch site content for key: ${key}`, err);
      } finally {
        setLoading(false);
      }
    }

    if (key) fetchContent();
  }, [key]);

  return { content, loading };
}

export function useAllSiteContent() {
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch(apiUrl("/api/admin/content"));
        if (res.ok) {
          const data = await res.json();
          const map = {};
          data.content.forEach(c => { map[c.key] = c; });
          setContentMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch all site content", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return { contentMap, loading };
}
