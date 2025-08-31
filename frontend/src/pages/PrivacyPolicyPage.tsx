import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
          variant="text"
        >
          Back to Home
        </Button>
        
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Privacy Policy
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Last updated: August 2025
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                1. Introduction
              </Typography>
              <Typography variant="body1" paragraph>
                Floweasy ("we", "our", or "us") operates the file splitting tool service (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </Typography>
              <Typography variant="body1" paragraph>
                By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                2. Information We Collect
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                2.1 Personal Information
              </Typography>
              <Typography variant="body1" paragraph>
                When you register for an account, we collect:
                • Email address
                • Password (encrypted and hashed)
                • Account creation timestamp
                • Subscription status and payment information
              </Typography>
              
              <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                2.2 File Data
              </Typography>
              <Typography variant="body1" paragraph>
                When you use our file processing service, we temporarily store:
                • Uploaded files for processing purposes only
                • File metadata (name, size, format)
                • Processing results and generated files
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Important:</strong> All uploaded files and processing results are automatically deleted from our servers within 1 hour after processing completion.
              </Typography>
              
              <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                2.3 Usage Data
              </Typography>
              <Typography variant="body1" paragraph>
                We collect usage information including:
                • Number of files processed per day (per user)
                • File metadata (original filename, file size, selected column names)
                • Login timestamps and authentication events
                • File processing status and error messages
                • Application logs for system monitoring and debugging
                • Email delivery logs for password reset functionality
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                3. How We Use Your Information
              </Typography>
              <Typography variant="body1" paragraph>
                We use the collected information for the following purposes:
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Service Provision:</strong> To process your files and provide the splitting functionality
                • <strong>Account Management:</strong> To create, maintain, and secure your account
                • <strong>Usage Tracking:</strong> To enforce daily limits based on your subscription tier
                • <strong>Payment Processing:</strong> To manage subscriptions and billing through Paddle
                • <strong>System Monitoring:</strong> To maintain system stability and troubleshoot technical issues
                • <strong>Security:</strong> To detect and prevent fraudulent activities and security threats
                • <strong>Communication:</strong> To send important service updates and subscription notifications
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                4. Data Storage and Security
              </Typography>
              <Typography variant="body1" paragraph>
                We implement appropriate technical and organizational security measures to protect your information:
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Encryption:</strong> All data transmission is encrypted using HTTPS/TLS
                • <strong>Password Security:</strong> Passwords are hashed using bcrypt algorithms
                • <strong>Data Storage:</strong> User data is stored in Redis cache with automatic expiration
                • <strong>Token Security:</strong> JWT tokens are blacklisted upon logout
                • <strong>Automatic Deletion:</strong> All uploaded files and processing data are automatically purged within 1 hour
                • <strong>Secure Infrastructure:</strong> Our servers and databases are protected with industry-standard security measures
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                5. Third-Party Services
              </Typography>
              <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                5.1 Payment Processing (Paddle)
              </Typography>
              <Typography variant="body1" paragraph>
                We use Paddle as our payment processor for premium subscriptions. Paddle collects and processes payment information according to their privacy policy. We do not store credit card information on our servers.
              </Typography>
              
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                6. Data Sharing and Disclosure
              </Typography>
              <Typography variant="body1" paragraph>
                We do not sell, trade, or rent your personal information to third parties. We may disclose your information only in the following circumstances:
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Legal Requirements:</strong> When required by law, regulation, or legal process
                • <strong>Service Providers:</strong> To trusted third-party services that help us operate our service (such as Paddle for payments)
                • <strong>Security Incidents:</strong> To protect the rights, property, and safety of our users and service
                • <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with prior notice)
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                7. Data Retention
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>File Data:</strong> Automatically deleted within 1 hour after processing
                • <strong>Account Information:</strong> Stored in Redis cache while your account is active
                • <strong>Daily Usage Counters:</strong> Automatically reset every 24 hours
                • <strong>Processing Tasks:</strong> Task metadata expires after 1 hour
                • <strong>Application Logs:</strong> System logs retained for operational purposes
                • <strong>Payment Records:</strong> Retained as required by law and Paddle's policies
              </Typography>
              <Typography variant="body1" paragraph>
                When you delete your account, we will remove your personal information from our Redis cache. Note that some data may persist in system logs for operational and security purposes.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                8. Your Rights and Choices
              </Typography>
              <Typography variant="body1" paragraph>
                You have the following rights regarding your personal information:
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Access:</strong> Request access to your personal information
                • <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                • <strong>Deletion:</strong> Request deletion of your personal information
                • <strong>Data Portability:</strong> Request a copy of your data in a portable format
                • <strong>Opt-out:</strong> Unsubscribe from non-essential communications
              </Typography>
              <Typography variant="body1" paragraph>
                To exercise these rights, please contact us at contact.floweasy@gmail.com.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                9. International Data Transfers
              </Typography>
              <Typography variant="body1" paragraph>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                10. Children's Privacy
              </Typography>
              <Typography variant="body1" paragraph>
                Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                11. Changes to This Privacy Policy
              </Typography>
              <Typography variant="body1" paragraph>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes will be communicated via email or in-service notifications.
              </Typography>
              <Typography variant="body1" paragraph>
                You are advised to review this Privacy Policy periodically for any changes. Continued use of our Service after changes indicates your acceptance of the updated Privacy Policy.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                12. Contact Information
              </Typography>
              <Typography variant="body1" paragraph>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Floweasy</strong><br />
                Email: contact.floweasy@gmail.com
              </Typography>
              <Typography variant="body1" paragraph>
                We will respond to your inquiries within 30 days and work to resolve any privacy concerns promptly.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};