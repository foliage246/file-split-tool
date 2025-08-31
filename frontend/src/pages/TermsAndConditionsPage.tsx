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

export const TermsAndConditionsPage: React.FC = () => {
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
            Terms and Conditions
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Last updated: August 2025
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ '& > *': { mb: 3 } }}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                1. Service Description
              </Typography>
              <Typography variant="body1" paragraph>
                Floweasy operates this file splitting tool (the "Service"), a web-based application that allows users to upload and process CSV, Excel, and text files, splitting them into multiple smaller files based on values in a single column.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                2. Acceptance of Terms
              </Typography>
              <Typography variant="body1" paragraph>
                By accessing and using this Service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                3. Service Tiers
              </Typography>
              <Typography variant="body1" paragraph>
                We offer two service tiers:
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Free Tier:</strong>
                • Process up to 5 files per day
                • File size limit: 10MB
                • All file formats supported (CSV, Excel, TXT)
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Premium Tier:</strong>
                • Process up to 50 files per day
                • File size limit: 100MB
                • All file formats supported (CSV, Excel, TXT)
                • Monthly fee: $9.99 USD
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                4. User Responsibilities
              </Typography>
              <Typography variant="body1" paragraph>
                Users agree to:
                • Only upload files you have legal rights to process
                • Not upload files containing malware, viruses, or harmful content
                • Not abuse the service or attempt to circumvent usage limits
                • Keep your account credentials secure
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                5. Privacy and Data Processing
              </Typography>
              <Typography variant="body1" paragraph>
                • Uploaded files are used solely for processing purposes
                • All files are automatically deleted within 1 hour after processing
                • We do not store or analyze your file contents
                • User data collection and usage follows our Privacy Policy
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                6. Payment and Refunds
              </Typography>
              <Typography variant="body1" paragraph>
                • Premium subscription fees are processed securely through Paddle
                • Subscriptions are billed monthly and can be cancelled at any time
                • Refund policy: Full refund available within first 7 days of subscription
                • For privacy concerns, please refer to our <Button variant="text" onClick={() => navigate('/privacy')} sx={{ p: 0, textDecoration: 'underline' }}>Privacy Policy</Button>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                7. Service Availability
              </Typography>
              <Typography variant="body1" paragraph>
                • We strive to maintain high service availability but do not guarantee 100% uptime
                • Periodic maintenance may temporarily make the service unavailable
                • We reserve the right to modify or discontinue the service with reasonable advance notice
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                8. Intellectual Property
              </Typography>
              <Typography variant="body1" paragraph>
                • All source code, design, and functionality of this service are protected by intellectual property laws
                • Users retain all rights to their uploaded files
                • Processing results generated by the service belong to the user
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                9. Disclaimer
              </Typography>
              <Typography variant="body1" paragraph>
                This service is provided "as is" without any express or implied warranties. We do not guarantee that:
                • The service will meet your specific requirements
                • The service will be uninterrupted or error-free
                • Results obtained through the service will be accurate or reliable
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                10. Limitation of Liability
              </Typography>
              <Typography variant="body1" paragraph>
                Under no circumstances shall we be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use this service, even if we have been advised of the possibility of such damages.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                11. Termination
              </Typography>
              <Typography variant="body1" paragraph>
                • Users may terminate their use of the service at any time
                • We reserve the right to terminate user accounts for violations of these terms
                • Upon termination, the user's right to access the service will cease immediately
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                12. Terms Modification
              </Typography>
              <Typography variant="body1" paragraph>
                We reserve the right to modify these Terms of Service at any time. Significant changes will be communicated to users via email or in-service notifications. Continued use of the service constitutes acceptance of modified terms.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                13. Contact Information
              </Typography>
              <Typography variant="body1" paragraph>
                For any questions or concerns, please contact us:
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Floweasy</strong><br />
                Email: contact.floweasy@gmail.com
              </Typography>
              <Typography variant="body1" paragraph>
                We will respond to your inquiries as soon as possible.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};