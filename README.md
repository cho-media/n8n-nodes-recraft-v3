# n8n-nodes-recraft-v3

![npm version](https://img.shields.io/npm/v/n8n-nodes-recraft-v3)
![License](https://img.shields.io/npm/l/n8n-nodes-recraft-v3)
![Downloads](https://img.shields.io/npm/dt/n8n-nodes-recraft-v3)

> **⚠️ Disclaimer**: This is an **unofficial community node** created for testing and educational purposes using Claude Sonnet 4. While built following n8n best practices and thoroughly tested, this node is **not officially supported by Recraft AI or n8n**. Use at your own discretion and always test thoroughly in non-production environments first.

This is an n8n community node for the **Recraft v3 AI image generation and editing API**

## ✨ Features

### 🎨 **Complete Image Generation**
- **Text-to-Image**: Generate stunning images from text prompts (up to 1000 bytes)
- **Multiple Images**: Generate 1-6 images per request
- **Vector & Raster**: Support for both vector and raster image generation
- **Multiple Styles**: Realistic images, digital illustrations, vector illustrations, icons, and logo raster
- **Comprehensive Sub-styles**: 20+ realistic substyles, 35+ digital illustration substyles, 20+ vector substyles, and more
- **Custom Styles**: Create and use custom brand styles from reference images
- **Advanced Controls**: Artistic level, background color, color preferences, and text layout positioning
- **Negative Prompts**: Specify what you don't want in your images

### 🛠️ **Complete Image Editing**
- **Image-to-Image**: Transform existing images based on prompts with strength control
- **Multiple Image Generation**: Generate multiple variations in one request
- **Inpainting**: Replace specific parts of images using masks
- **Background Operations**: Replace or remove backgrounds automatically
- **Vectorization**: Convert raster images to scalable SVG format
- **Upscaling**: Both crisp and creative upscaling for enhanced resolution
- **Flexible Response Formats**: Get URLs or base64 data

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

### Advanced Text-to-Image Generation
```yaml
Resource: Image
Operation: Generate
Prompt: "A serene landscape with mountains reflected in a crystal-clear lake at golden hour"
Model: Recraft V3
Style: Realistic Image
Sub Style: Natural Light
Number of Images: 3
Negative Prompt: "blurry, low quality, people"
Advanced Options:
  Artistic Level: 4
  Background Color: RGB(135, 206, 235)
  Colors: [RGB(255, 215, 0), RGB(139, 69, 19)]
```

### Custom Brand Style Creation
```yaml
Resource: Style
Operation: Create
Base Style: Digital Illustration
Reference Images: data (binary property with 3-5 brand reference images)
```

### Multi-Image Transformation
```yaml
Resource: Image
Operation: Image to Image
Input Image: data (binary property with source image)
Prompt: "Transform to a winter scene with snow and ice"
Strength: 0.7
Style: Realistic Image
Number of Images: 4
Negative Prompt: "summer, heat, desert"
```

### Professional Vector Art
```yaml
Resource: Image
Operation: Generate
Prompt: "Clean geometric logo of a mountain peak with sun rays"
Style: Vector Illustration
Sub Style: Line Art
Size: 1024x1024
Response Format: URL
```

### Advanced Background Operations
```yaml
Resource: Image
Operation: Replace Background
Input Image: data (source image)
Prompt: "Professional office environment with soft lighting"
Style: Realistic Image
Number of Images: 2
Response Format: Base64 JSON
```

## 🎯 Supported Operations

### Image Operations
- **Generate**: Create images from text prompts with full control
- **Image to Image**: Transform images with prompts and strength control
- **Inpaint**: Replace masked areas in images with precision
- **Replace Background**: Change image backgrounds intelligently
- **Remove Background**: Remove backgrounds completely
- **Vectorize**: Convert to SVG format for infinite scalability
- **Crisp Upscale**: Enhance resolution (sharp and clean)
- **Creative Upscale**: Enhance resolution (detailed and refined)

### Style Operations
- **Create**: Build custom styles from reference images (up to 5 images, max 5MB total)

### User Operations
- **Get Info**: Retrieve account and credit information

## 🎨 Complete Style & Substyle Options

### Realistic Image (20 substyles)
- Black & White, Enterprise, Evening Light, Faded Nostalgia, Forest Life, Hard Flash, HDR, Motion Blur, Mystic Naturalism, Natural Light, Natural Tones, Organic Calm, Real Life Glow, Retro Realism, Retro Snapshot, Studio Portrait, Urban Drama, Village Realism, Warm Folk

### Digital Illustration (35 substyles)
- 2D Art Poster, Antiquarian, Bold Fantasy, Child Book, Cover, Crosshatch, Digital Engraving, Engraving Color, Expressionism, Freehand Details, Grain, Graphic Intensity, Hand Drawn, Hand Drawn Outline, Handmade 3D, Hard Comics, Infantile Sketch, Long Shadow, Modern Folk, Multicolor, Neon Calm, Noir, Nostalgic Pastel, Outline Details, Pastel Gradient, Pastel Sketch, Pixel Art, Plastic, Pop Art, Pop Renaissance, Seamless, Street Art, Tablet Sketch, Urban Glow, Urban Sketching, Young Adult Book

### Vector Illustration (20 substyles)
- Bold Stroke, Chemistry, Colored Stencil, Cosmics, Cutout, Depressive, Editorial, Emotional Flat, Engraving, Line Art, Line Circuit, Linocut, Marker Outline, Mosaic, Naivector, Roundish Flat, Seamless, Segmented Colors, Sharp Contrast, Thin, Vector Photo, Vivid Shapes

### Logo Raster (5 substyles)
- Emblem Graffiti, Emblem Pop Art, Emblem Punk, Emblem Stamp, Emblem Vintage

## 📐 Supported Image Sizes

- **Square**: 1024x1024
- **Landscape**: 1365x1024, 1536x1024, 1820x1024, 2048x1024, 1434x1024, 1280x1024, 1707x1024
- **Portrait**: 1024x1365, 1024x1536, 1024x1820, 1024x2048, 1024x1434, 1024x1280, 1024x1707

## 🔧 Advanced Features

### Controls & Customization
- **Artistic Level**: Fine-tune creative expression (0-5 scale)
- **Background Color**: Set exact background colors with RGB values
- **Color Preferences**: Specify multiple preferred colors for the image
- **No Text**: Disable automatic text embedding
- **Negative Prompts**: Exclude unwanted elements from all operations

### Text Layout (Recraft V3 Only)
Position text elements precisely using bounding box coordinates:
```json
[[0.3, 0.45], [0.6, 0.45], [0.6, 0.55], [0.3, 0.55]]
```

### Multi-Image Generation
Generate 1-6 images per request for:
- Text-to-image generation
- Image-to-image transformation  
- Inpainting operations
- Background replacement

### Custom Styles
Upload up to 5 reference images (max 5MB total) to create brand-consistent styles for all your generations.

## 📁 File Support

- **Input Formats**: PNG, JPG, JPEG, WEBP
- **Output Formats**: PNG, JPG, WEBP, SVG (vectorization), Base64 data
- **Maximum File Size**: 5 MB per image
- **Maximum Resolution**: 16 MP (4 MP for crisp upscale)
- **Maximum Dimension**: 4096 pixels
- **Minimum Dimension**: 256 pixels (32 for crisp upscale)

## 💰 Pricing

- **Recraft V3 Raster**: $0.04 per image (40 API units)
- **Recraft V3 Vector**: $0.08 per image (80 API units)
- **Recraft V2 Raster**: $0.022 per image (22 API units)
- **Recraft V2 Vector**: $0.044 per image (44 API units)
- **Vectorization**: $0.01 per image (10 API units)
- **Background Removal**: $0.01 per image (10 API units)
- **Crisp Upscale**: $0.004 per image (4 API units)
- **Creative Upscale**: $0.25 per image (250 API units)
- **Style Creation**: $0.04 per style (40 API units)

Check [Recraft pricing](https://www.recraft.ai/pricing) for complete details.

## 🚨 Error Handling

The node includes comprehensive error handling:
- File size and format validation
- API rate limit handling
- Network error recovery
- Clear error messages with specific guidance
- Continue on fail option
- Input validation for all parameters

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
- Thoroughly reviewed against 2025 n8n community node standards and complete Recraft API
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
