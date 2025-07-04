# n8n-nodes-recraft-v3

![npm version](https://img.shields.io/npm/v/n8n-nodes-recraft-v3)
![License](https://img.shields.io/npm/l/n8n-nodes-recraft-v3)
![Downloads](https://img.shields.io/npm/dt/n8n-nodes-recraft-v3)

> **⚠️ Disclaimer**: This is an **unofficial community node** created for testing and educational purposes using Claude Sonnet 4. While built following n8n best practices and thoroughly tested, this node is **not officially supported by Recraft AI or n8n**. Use at your own discretion and always test thoroughly in non-production environments first.

This is an n8n community node for the **Recraft v3 AI image generation and editing API**

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
```

## 📋 Prerequisites

1. **Recraft Account**: Sign up at [recraft.ai](https://recraft.ai)
2. **API Key**: Get your API key from your [Recraft profile](https://app.recraft.ai/profile/api)
3. **API Credits**: Purchase API units to use the service ($0.04 per raster image, $0.08 per vector image)

## ⚙️ Setup

1. **Add Credentials**:
   - Go to **Credentials** in n8n
   - Click **Add Credential** and search for "Recraft API"
   - Enter your API token from Recraft

2. **Add Node**:
   - Add the **Recraft v3** node to your workflow
   - Configure the operation you want to perform

## 💡 Usage Examples

### Text-to-Image Generation
```yaml
Resource: Image
Operation: Generate
Prompt: "A serene landscape with mountains reflected in a crystal-clear lake at golden hour"
Model: Recraft V3
Style: Realistic Image
Size: 1024x1024
```

### Custom Brand Style Creation
```yaml
Resource: Style
Operation: Create
Base Style: Digital Illustration
Reference Images: data (binary property with 3-5 brand reference images)
```

### Image Transformation
```yaml
Resource: Image
Operation: Image to Image
Input Image: data (binary property with source image)
Prompt: "Transform to a winter scene with snow and ice"
Strength: 0.7
Style: Realistic Image
```

### Vector Art Generation
```yaml
Resource: Image
Operation: Generate
Prompt: "Clean geometric logo of a mountain peak with sun rays"
Style: Vector Illustration
Size: 1024x1024
```

### Background Operations
```yaml
Resource: Image
Operation: Replace Background
Input Image: data (source image)
Prompt: "Professional office environment with soft lighting"
Style: Realistic Image
```

## 🎯 Supported Operations

### Image Operations
- **Generate**: Create images from text prompts
- **Image to Image**: Transform images with prompts
- **Inpaint**: Replace masked areas in images
- **Replace Background**: Change image backgrounds
- **Remove Background**: Remove backgrounds completely
- **Vectorize**: Convert to SVG format
- **Crisp Upscale**: Enhance resolution (sharp)
- **Creative Upscale**: Enhance resolution (detailed)

### Style Operations
- **Create**: Build custom styles from reference images

### User Operations
- **Get Info**: Retrieve account and credit information

## 🎨 Available Styles

### Base Styles
- **Realistic Image**: Photo-like images from digital cameras
- **Digital Illustration**: Hand-drawn or computer-generated art
- **Vector Illustration**: Clean vector graphics with flat colors
- **Icon**: Simple, recognizable symbols

### Sub-styles (Digital Illustration)
- Hand Drawn
- Pixel Art
- Cartoon
- Anime
- 3D Render

## 📐 Supported Image Sizes

- **Square**: 1024x1024
- **Landscape**: 1365x1024, 1536x1024, 1820x1024, 2048x1024
- **Portrait**: 1024x1365, 1024x1536, 1024x1820, 1024x2048
- **Standard**: 1280x1024, 1024x1280

## 🔧 Advanced Features

### Color Control
Specify exact RGB colors to include in your generated images.

### Text Layout
Position text elements precisely using bounding box coordinates:
```json
[[0.3, 0.45], [0.6, 0.45], [0.6, 0.55], [0.3, 0.55]]
```

### Custom Styles
Upload 3-5 reference images to create brand-consistent styles for all your generations.

## 📁 File Support

- **Input Formats**: PNG, JPG, JPEG, WEBP
- **Output Formats**: PNG, JPG, WEBP, SVG (vectorization)
- **Maximum File Size**: 5 MB
- **Maximum Resolution**: 16 MP
- **Maximum Dimension**: 4096 pixels
- **Minimum Dimension**: 256 pixels (32 for crisp upscale)

## 💰 Pricing

- **Raster Image Generation**: $0.04 per image
- **Vector Image Generation**: $0.08 per image
- **Other Operations**: Vary by complexity
- Check [Recraft pricing](https://www.recraft.ai/pricing) for details

## 🚨 Error Handling

The node includes comprehensive error handling:
- File size and format validation
- API rate limit handling
- Network error recovery
- Clear error messages
- Continue on fail option

## 🔗 Resources

- [Recraft Website](https://www.recraft.ai)
- [Recraft API Documentation](https://www.recraft.ai/docs)
- [Get API Key](https://app.recraft.ai/profile/api)
- [n8n Community](https://community.n8n.io)

## 📝 License

MIT License - see LICENSE file for details.

## ⚠️ Important Disclaimers

### Unofficial Community Node
- This node is **not officially endorsed or supported** by Recraft AI or n8n
- Created by the community for educational and testing purposes
- Built using Claude Sonnet 4 AI assistance following n8n development standards

### Development & Testing
- Code follows n8n best practices and includes comprehensive error handling
- Thoroughly reviewed against 2025 n8n community node standards
- **Recommended**: Test in development environments before production use
- Always validate outputs and monitor API usage

### Support & Liability
- Community-supported through GitHub issues
- No warranty or guarantee of functionality
- Users responsible for API costs and usage
- Not affiliated with Recraft AI - please respect their terms of service

### Contributing & Feedback
- Bug reports and contributions welcome via GitHub
- This is a learning project - improvements and suggestions appreciated
- Help make this the best community Recraft integration possible!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 🐛 Support

- Check the [Recraft documentation](https://www.recraft.ai/docs)
- Visit the [n8n community forum](https://community.n8n.io)
- Open an issue on this repository

---
