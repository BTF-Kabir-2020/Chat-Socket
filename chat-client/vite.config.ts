import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./", // برای تنظیم مسیرهای نسبی
  plugins: [react(), viteSingleFile()], // اضافه کردن پلاگین singlefile
});
