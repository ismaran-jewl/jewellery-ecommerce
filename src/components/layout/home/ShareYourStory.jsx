"use client";

import { useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Camera, Instagram, Facebook, Twitter } from "lucide-react";

const stories = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop",
    name: "Sarah & James",
    text: `"We'll never forget the day he proposed. This ring is a symbol of our beginning."`,
    x: "5%", y: "20%", rotate: -6, delay: 0
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop",
    name: "Elena's 30th",
    text: `"My friends gifted me this necklace for my birthday. It shines as bright as our memories together."`,
    x: "75%", y: "15%", rotate: 6, delay: 0.1
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    name: "The Graduation",
    text: `"A gift from my parents to celebrate a new chapter. It reminds me how far I've come."`,
    x: "10%", y: "65%", rotate: 4, delay: 0.2
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    name: "Anniversary",
    text: `"Ten years of love, captured in one timeless piece. It's more than a jewel, it's our story."`,
    x: "80%", y: "60%", rotate: -4, delay: 0.3
  },
];

const socialPosts = [
  { id: 101, img: "https://images.unsplash.com/photo-1573408302354-010549b15295?q=80&w=300&auto=format&fit=crop", platform: "Instagram", x: "2%", y: "45%", rotate: 8, delay: 0.4, icon: Instagram },
  { id: 102, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop", platform: "Facebook", x: "90%", y: "25%", rotate: -10, delay: 0.6, icon: Facebook },
  { id: 103, img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop", platform: "Pinterest", x: "12%", y: "85%", rotate: 5, delay: 0.8, icon: Sparkles },
  { id: 104, img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=300&auto=format&fit=crop", platform: "Instagram", x: "82%", y: "5%", rotate: -7, delay: 1.0, icon: Instagram },
  { id: 105, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop", platform: "Twitter", x: "70%", y: "92%", rotate: 12, delay: 1.2, icon: Twitter },
  { id: 106, img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=300&auto=format&fit=crop", platform: "Instagram", x: "28%", y: "92%", rotate: -5, delay: 1.4, icon: Instagram },
];

function FloatingImage({ story, mouseX, mouseY }) {
  const xRange = [50 * (story.id % 2 === 0 ? 1 : -1), -50 * (story.id % 2 === 0 ? 1 : -1)];
  const yRange = [50 * (story.id % 2 === 0 ? -1 : 1), -50 * (story.id % 2 === 0 ? -1 : 1)];

  const x = useTransform(mouseX, [0, 1], xRange);
  const y = useTransform(mouseY, [0, 1], yRange);
  const xSpring = useSpring(x, { stiffness: 40, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: story.delay }}
      style={{
        left: story.x,
        top: story.y,
        x: xSpring,
        y: ySpring,
        rotate: story.rotate,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.9)",
      }}
      className="absolute hidden lg:block w-56 aspect-[3/4] p-2 shadow-2xl rounded-lg z-10 hover:z-30 transition-all duration-500 group cursor-pointer"
      whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{
          y: [0, -12, 0],
          rotate: [0, story.id % 2 === 0 ? 1 : -1, 0]
        }}
        transition={{
          duration: 4 + story.id,
          repeat: Infinity,
          ease: "easeInOut",
          delay: story.delay
        }}
      >
        <div className="relative w-full h-full overflow-hidden bg-neutral-100 rounded-md">
          <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end text-left p-4">
            <p className="font-serif text-lg mb-1 italic" style={{ color: "#FFD4C2" }}>{story.name}</p>
            <p className="text-white/90 text-xs font-light leading-snug">{story.text}</p>
          </div>
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/30 backdrop-blur-sm rounded-sm opacity-80 -rotate-6" />
      </motion.div>
    </motion.div>
  );
}

function SocialPostCard({ post, mouseX, mouseY }) {
  const Icon = post.icon;
  const xRange = [30 * (post.id % 2 === 0 ? 1 : -1), -30 * (post.id % 2 === 0 ? 1 : -1)];
  const yRange = [30 * (post.id % 2 === 0 ? -1 : 1), -30 * (post.id % 2 === 0 ? -1 : 1)];

  const x = useTransform(mouseX, [0, 1], xRange);
  const y = useTransform(mouseY, [0, 1], yRange);
  const xSpring = useSpring(x, { stiffness: 30, damping: 25 });
  const ySpring = useSpring(y, { stiffness: 30, damping: 25 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 0.6, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: post.delay }}
      style={{
        left: post.x,
        top: post.y,
        x: xSpring,
        y: ySpring,
        rotate: post.rotate,
      }}
      className="absolute hidden lg:block w-32 aspect-square p-1.5 shadow-xl rounded-lg z-0 hover:z-20 hover:opacity-100 transition-all duration-700 cursor-none grayscale hover:grayscale-0 group"
    >
      <motion.div
        className="w-full h-full relative bg-white rounded-md overflow-hidden p-1 border border-neutral-100"
        animate={{
          y: [0, 8, 0],
          x: [0, -4, 0]
        }}
        transition={{
          duration: 5 + (post.id % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: post.delay
        }}
      >
        <img src={post.img} alt="Customer Post" className="w-full h-full object-cover rounded shadow-inner" />
        <div className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
          <Icon size={10} className="text-orange-600" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ShareYourStory() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-20 lg:py-32 min-h-[auto] lg:min-h-[850px] bg-transparent overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Warm glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none z-[1]"
        style={{ background: "#FDFBF7", opacity: 0.15 }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.16, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-[1]"
        style={{ background: "#F5F5F0", opacity: 0.12 }}
      />

      {/* Floating Polaroid images (desktop) */}
      <div className="absolute inset-0 z-[2]">
        {stories.map((story) => (
          <FloatingImage key={story.id} story={story} mouseX={mouseX} mouseY={mouseY} />
        ))}
        {socialPosts.map((post) => (
          <SocialPostCard key={post.id} post={post} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs tracking-[0.2em] uppercase mb-10 backdrop-blur-md cursor-default"
            style={{
              borderColor: "rgba(255,212,194,0.3)",
              background: "rgba(255,212,194,0.08)",
              color: "#FFD4C2",
            }}
          >
            <Sparkles size={14} />
            <span>Ismaran Community</span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-serif mb-8 leading-[0.9] tracking-tight" style={{ color: "#3D1F0D" }}>
            Your Story, <br />
            <span
              className="italic relative"
              style={{
                background: "linear-gradient(135deg, #8B5E3C 0%, #B58463 50%, #6B4226 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Legacy
              <motion.svg
                className="absolute w-full h-3 -bottom-1 left-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <path d="M0 5 Q 50 10 100 5" stroke="#8B5E3C" strokeWidth="2" fill="none" />
              </motion.svg>
            </span>
          </h2>

          <p className="text-base md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed" style={{ color: "#7A4528" }}>
            More than just jewellery, each piece is a silent storyteller. Your moments give it a voice, your memories make it a treasure.
            Share your story and become part of the Ismaran legacy.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              className="group h-14 px-10 rounded-full text-sm tracking-[0.15em] uppercase font-bold transition-all hover:scale-105 border-0"
              style={{
                background: "linear-gradient(135deg, #FFD4C2, #FF9E80)",
                color: "#2D2D2D",
                boxShadow: "0 0 40px -10px rgba(255,158,128,0.5)",
              }}
            >
              <Camera className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
              Upload Photo
            </Button>
            <Button
              variant="outline"
              className="group h-14 px-10 rounded-full text-sm tracking-[0.15em] uppercase font-bold backdrop-blur-sm transition-all"
              style={{
                borderColor: "rgba(61, 31, 13, 0.15)",
                background: "rgba(61, 31, 13, 0.05)",
                color: "#3D1F0D",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,158,128,0.5)";
                e.currentTarget.style.color = "#FF9E80";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(61, 31, 13, 0.15)";
                e.currentTarget.style.color = "#3D1F0D";
              }}
            >
              View Gallery
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Stories Slider */}
      <div className="lg:hidden w-full mt-16 overflow-x-auto pb-8 px-6 z-20 snap-x snap-mandatory">
        <div className="flex gap-4 w-max">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-64 aspect-[3/4] bg-white p-2 rounded-lg shadow-xl snap-center shrink-0"
            >
              <div className="relative w-full h-full overflow-hidden bg-neutral-100 rounded-md">
                <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end text-left p-4">
                  <p className="font-serif text-lg mb-1 italic" style={{ color: "#FFD4C2" }}>{story.name}</p>
                  <p className="text-white/90 text-xs font-light leading-snug line-clamp-3">{story.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}