import { useState } from "react";
import { motion } from "framer-motion";

export default function Test() {
  const [expandex, setExpand] = useState(false);

  return (
    <div>
      {/* Один и тот же элемент — меняем только стили */}
      <motion.div
        layoutId="card-id"
        layout
        onClick={() => setExpand(!expandex)}
        style={{
          position: "absolute",
          width: expandex ? 80 : 80,
          height: expandex ? 300 : 80,
          borderRadius: expandex ? 32 : "50%",
          background: expandex ? "#ff3366" : "#00ccff",
          cursor: "pointer",
          // позиционирование
          top: expandex ? 125 : 40,
          left: expandex ? 125 : 40,
          transform: expandex ? "translate(-50%, -50%)" : "none",
          zIndex: 10,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 1.1,
        }}
      >
        <motion.div
          layout
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: expandex ? 36 : 20,
            fontWeight: "bold",
            textShadow: "0 2px 10px rgba(0,0,0,0.7)",
          }}
        >
          {expandex ? "По центру!" : "Клик"}
        </motion.div>
      </motion.div>

      {/* Затемнение фона при открытии */}
      {expandex && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}