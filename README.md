# n8n-nodes-recraft-v3

![npm version](https://img.shields.io/npm/v/n8n-nodes-recraft-v3)
![License](https://img.shields.io/npm/l/n8n-nodes-recraft-v3)
![Downloads](https://img.shields.io/npm/dt/n8n-nodes-recraft-v3)

> **⚠️ Disclaimer**: This is an **unofficial community node** created for testing and educational purposes using Claude Sonnet 4. While built following n8n best practices and thoroughly tested, this node is **not officially supported by Recraft AI or n8n**. Use at your own discretion and always test thoroughly in non-production environments first.

This is an n8n community node for the **Recraft v3 AI image generation and editing API** - the #1 ranked text-to-image model on Hugging Face's benchmark.

## ✨ Features

### 🎨 **Image Generation**
- **Text-to-Image**: Generate stunning images from text prompts (up to 4000 characters)
- **Vector & Raster**: Support for both vector and raster image generation
- **Multiple Styles**: Realistic images, digital illustrations, vector illustrations, and icons
- **Sub-styles**: Hand drawn, pixel art, cartoon, anime, 3D render options
- **Custom Styles**: Create and use custom brand styles from reference images
- **Advanced Controls**: Color control and precise text layout positioning

### 🛠️ **Image Editing**
- **Image-to-Image**: Transform existing images based on prompts with strength control
- **Inpainting**: Replace specific parts of images using masks
- **Background Operations**: Replace or remove backgrounds automatically
- **Vectorization**: Convert raster images to scalable SVG format
- **Upscaling**: Both crisp and creative upscaling for enhanced resolution

### 📊 **Account Management**
- **User Info**: Get account information and credits balance
- **API Usage**: Monitor your API usage and remaining credits

## 🚀 Installation

### Option 1: n8n Community Nodes (Recommended)
1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Click **Install** and enter: `n8n-nodes-recraft-v3`
3. Click **Install**

### Option 2: Manual Installation
```bash
# In your n8n installation directory
npm install n8n-nodes-recraft-v3
