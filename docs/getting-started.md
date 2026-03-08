# Getting Started with SentinelGate

This guide will help you get SentinelGate up and running in minutes. SentinelGate provides enterprise-grade SQL injection protection with a simple integration model.

## 🚀 Quick Start (5 Minutes)

### Step 1: Add SentinelGate to Your Website

Add this single script tag to your website's `<head>` or before `</body>`:

```html
<script src="https://your-sentinelgate-domain.com/sentinel-gate.js"></script>
```

**Replace `https://your-sentinelgate-domain.com` with your deployed SentinelGate URL.**

### Step 2: Test the Protection

Open your website and try these test inputs in any form field:

```
admin' OR '1'='1' --
'; DROP TABLE users; --
' UNION SELECT password FROM users --
```

These should be **automatically blocked** before reaching your server.

### Step 3: Monitor Protection

Visit your SentinelGate dashboard to see:
- Blocked attacks in real-time
- Attack patterns and sources
- System performance metrics

That's it! Your website is now protected against SQL injection attacks.

## 📋 Prerequisites

### For Basic Integration
- **Any Website**: HTML, PHP, React, Vue, Angular, etc.
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **No Technical Knowledge**: Zero security expertise required

### For Self-Hosting
- **Node.js 16+** (for frontend development)
- **Python 3.8+** (for backend)
- **Git** (for cloning repository)
- **Basic Command Line** knowledge

## 🛠️ Installation Options

### Option 1: Cloud-Hosted (Recommended)

Easiest option with zero maintenance:

1. **Sign up** for a SentinelGate account
2. **Get your unique script URL**
3. **Add one line** to your website
4. **Done!** Protection is active immediately

#### Benefits
- ✅ Zero maintenance
- ✅ Automatic updates
- ✅ 99.99% uptime
- ✅ 24/7 monitoring
- ✅ Compliance reporting

### Option 2: Self-Hosted

For organizations requiring on-premises deployment:

```bash
# Clone the repository
git clone https://github.com/your-org/sentinel-gate-anti-sql-injection.git
cd sentinel-gate-anti-sql-injection

# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..

# Start the application
python app.py
```

Your SentinelGate instance is now running at `http://localhost:5001`

### Option 3: Docker Deployment

Containerized deployment for easy scaling:

```bash
# Build the Docker image
docker build -t sentinelgate .

# Run the container
docker run -p 5001:5001 sentinelgate
```

## 🌐 Deployment Platforms

### Vercel (Serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts to configure
```

### Render

1. **Connect your GitHub repository** to Render
2. **Configure build settings**:
   - Build Command: `pip install -r requirements.txt && cd frontend && npm install && npm run build`
   - Start Command: `gunicorn -w 1 -b 0.0.0.0:$PORT app:app`
3. **Deploy** - Your app will be live in minutes

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🔧 Configuration

### Basic Configuration

Customize protection levels by adding configuration before the script:

```html
<script>
window.SentinelGateConfig = {
    blockMessage: "SQL injection detected! Input blocked for security.",
    logLevel: "info",           // debug, info, warn, error
    enableML: true,             // Enable ML detection
    apiEndpoint: "/api/predict" // Custom ML endpoint
};
</script>
<script src="https://your-sentinelgate-domain.com/sentinel-gate.js"></script>
```

### Advanced Configuration

```javascript
window.SentinelGateConfig = {
    // Blocking behavior
    blockMessage: "Security violation detected",
    showWarning: true,          // Show warning to user
    allowRetry: true,           // Allow user to retry input
    
    // Detection settings
    enableML: true,             // Machine learning detection
    mlThreshold: 0.7,           // ML confidence threshold
    enableBehaviorAnalysis: true, // User behavior monitoring
    
    // Performance settings
    cacheSize: 1000,            // Pattern cache size
    batchSize: 10,              // ML prediction batch size
    timeout: 5000,              // ML request timeout (ms)
    
    // Logging and monitoring
    logLevel: "info",
    enableAnalytics: true,      // Send anonymous usage stats
    apiEndpoint: "/api/predict", // Custom ML API endpoint
    
    // Custom patterns (advanced)
    customPatterns: [
        {
            name: "Custom Admin Bypass",
            pattern: /admin\s*or\s*1\s*=\s*1/i,
            severity: "HIGH"
        }
    ],
    
    // Callbacks
    onBlock: function(input, reason) {
        console.log("Blocked input:", input, "Reason:", reason);
        // Custom blocking logic
    },
    
    onWarning: function(input, risk) {
        console.warn("Suspicious input detected:", input, "Risk:", risk);
        // Custom warning logic
    }
};
```

## 🧪 Testing Your Integration

### Manual Testing

Test these SQL injection attempts in your forms:

```sql
-- Basic authentication bypass
admin' OR '1'='1' --
' OR 'x'='x' --

-- Union-based attacks
' UNION SELECT username, password FROM users --
' UNION SELECT table_name FROM information_schema.tables --

-- Comment-based attacks
'; DROP TABLE users; --
' /* comment */ OR 1=1 --

-- Time-based attacks
'; WAITFOR DELAY '00:00:05' --
' AND SLEEP(5) --

-- Advanced evasion
SELECT/**/FROM/**/users
admin'/**/OR/**/1=1--
```

### Automated Testing

Use our testing script to verify protection:

```javascript
// Test script - run in browser console
const testInputs = [
    "admin' OR '1'='1' --",
    "'; DROP TABLE users; --",
    "' UNION SELECT password FROM users --",
    "SELECT/**/FROM/**/users",
    "admin'/**/OR/**/1=1--"
];

async function runTests() {
    console.log("Testing SentinelGate protection...");
    
    for (const input of testInputs) {
        try {
            // Test via form input
            const testField = document.createElement('input');
            testField.value = input;
            document.body.appendChild(testField);
            
            // Trigger input event
            testField.dispatchEvent(new Event('input'));
            
            // Check if input was blocked
            setTimeout(() => {
                if (testField.value === input) {
                    console.log(`❌ FAILED: ${input} was not blocked`);
                } else {
                    console.log(`✅ PASSED: ${input} was blocked`);
                }
                document.body.removeChild(testField);
            }, 100);
            
        } catch (error) {
            console.error(`Error testing ${input}:`, error);
        }
    }
}

runTests();
```

### API Testing

Test the ML detection API directly:

```bash
# Test malicious input
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "SELECT * FROM users WHERE id = 1 OR 1=1"}'

# Test benign input
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "John Doe"}'
```

## 📊 Monitoring and Analytics

### Accessing the Dashboard

1. **Navigate** to your SentinelGate URL
2. **Click** on "Dashboard" or visit `/dashboard`
3. **View** real-time attack statistics

### Key Metrics

- **Total Attacks**: Number of SQL injection attempts
- **Blocked Attacks**: Successfully prevented attacks
- **Block Rate**: Percentage of attacks blocked
- **Top Patterns**: Most common attack patterns
- **Attack Sources**: Geographic distribution of attacks
- **Performance**: System response times

### Setting Up Alerts

Configure email alerts for high-volume attacks:

```javascript
// In your SentinelGate configuration
window.SentinelGateConfig = {
    alerts: {
        email: "security@yourcompany.com",
        threshold: 100,  // Alert after 100 blocked attacks
        cooldown: 3600   // Wait 1 hour between alerts
    }
};
```

## 🔍 Troubleshooting

### Common Issues

#### Script Not Loading
```html
<!-- Check the script URL is correct -->
<script src="https://your-domain.com/sentinel-gate.js"></script>

<!-- Verify the domain is accessible -->
<!-- Test in browser: https://your-domain.com/sentinel-gate.js -->
```

#### False Positives
```javascript
// Adjust sensitivity
window.SentinelGateConfig = {
    mlThreshold: 0.8,  // Increase threshold (default: 0.7)
    enableML: false    // Disable ML if too sensitive
};
```

#### Performance Issues
```javascript
// Optimize for high-traffic sites
window.SentinelGateConfig = {
    cacheSize: 5000,   // Increase cache size
    batchSize: 20,     // Increase batch size
    enableML: false    // Disable ML for maximum performance
};
```

#### ML Detection Not Working
```bash
# Check if ML API is accessible
curl http://localhost:5001/api/predict

# Verify ML dependencies are installed
pip install -r ml/requirements.txt

# Check ML model is trained
python ml/src/train.py
```

### Debug Mode

Enable detailed logging for troubleshooting:

```javascript
window.SentinelGateConfig = {
    logLevel: "debug",
    enableAnalytics: false  // Disable analytics during debugging
};
```

Then check browser console for detailed logs.

## 🚀 Advanced Features

### Custom Protection Rules

Add business-specific protection rules:

```javascript
window.SentinelGateConfig = {
    customPatterns: [
        {
            name: "Admin Privilege Escalation",
            pattern: /admin\s*(grant|privilege|access)/i,
            severity: "CRITICAL"
        },
        {
            name: "Database Backup Attempt",
            pattern: /(backup|dump|export)\s+(database|db)/i,
            severity: "HIGH"
        }
    ]
};
```

### Integration with Existing Security

Combine with other security measures:

```javascript
// Example: Integration with Google reCAPTCHA
window.SentinelGateConfig = {
    onBlock: function(input, reason) {
        // Trigger reCAPTCHA for suspicious attempts
        grecaptcha.execute();
    }
};
```

### API Rate Limiting

Protect your ML API from abuse:

```python
# In your Flask app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per minute"]
)

@app.route('/api/predict', methods=['POST'])
@limiter.limit("200 per minute")
def predict():
    # Your prediction logic
    pass
```

## 📚 Next Steps

### For Development Teams
- Read the [API Reference](./api-reference.md)
- Review the [Development Guide](./development.md)
- Explore the [ML Architecture](./ml-architecture.md)

### For Security Teams
- Review [Security Best Practices](./security-best-practices.md)
- Understand [Compliance Requirements](./compliance.md)
- Set up [Monitoring and Alerting](./monitoring.md)

### For Business Stakeholders
- Review the [Business Value](./business-value.md)
- Understand [ROI Analysis](./roi-analysis.md)
- Explore [Case Studies](./case-studies.md)

## 🆘 Getting Help

### Documentation
- 📖 [Full Documentation](./README.md)
- 🔧 [API Reference](./api-reference.md)
- ❓ [FAQ](./faq.md)

### Community
- 💬 [Discord Community](https://discord.gg/sentinelgate)
- 🐛 [GitHub Issues](https://github.com/your-org/sentinel-gate/issues)
- 📧 [Email Support](mailto:support@sentinelgate.com)

### Professional Support
- 🏢 Enterprise support available
- 🎯 Custom implementation services
- 📊 Security consulting

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Support Level**: Community (Enterprise available)  

Need help? Check our [troubleshooting guide](./troubleshooting.md) or [contact support](mailto:support@sentinelgate.com).
