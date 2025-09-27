import "./App.css";
import { motion } from "framer-motion";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";

const myAnimation = {
  initial: { opacity: 0, y: 50 },
  inView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

function App() {
  return (
    <>
      <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
          <motion.div
            initial="initial"
            whileInView="inView"
            viewport={{ once: true, amount: 0.7 }}
            variants={myAnimation}
          >
            <div class="max-w-md">
              <video
                src="/videos/hello.webm"
                autoPlay
                loop
                muted
                className="w-40 mx-auto"
              />
              <h1>Hello there</h1>
              <p className="py-6">
                This is a boilerplate for React + Vite + TailwindCSS + DaisyUI.
              </p>
              <button class="btn btn-primary">
                Get Started{" "}
                <HandThumbUpIcon className="inline-block align-middle w-[1em] h-[1em]" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default App;
