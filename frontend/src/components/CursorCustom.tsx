import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);

    document.body.style.cursor = "none";
    const style = document.createElement('style');
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.body.style.cursor = "auto";
      style.remove();
    };
  }, []);

  return (
    <>
      {/* Curseur dot élégant */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50"
        style={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        animate={{
          scale: isHovering ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 25,
        }}
      >
        {/* Dot principal */}
        <motion.div
          className="w-3 h-3 rounded-full bg-[var(--color-accent)]"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Effet de lueur */}
        <motion.div
          className="absolute inset-0 w-3 h-3 rounded-full bg-[var(--color-accent)]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Cercle de suivi avec délai */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40 rounded-full border border-[var(--color-primary)]/30"
        style={{
          width: "40px",
          height: "40px",
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        animate={{
          scale: isHovering ? 0.9 : 1.1,
          opacity: isHovering ? 0.4 : 0.1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          delay: 0.05,
        }}
      />
    </>
  );
};

export default CustomCursor;