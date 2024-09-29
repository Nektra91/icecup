import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';

type FAQItem = {
  question: string;
  answer: string;
};

const faqList: FAQItem[] = [
    {
      question: "How do I register for a competition?",
      answer: "To register for a competition, navigate to the 'Apply' page on our website. There, you can fill out the application form with your team details when a competition is active."
    },
    {
      question: "When is IceCup held?",
      answer: "IceCup is held on the first weekend of May. It starts on Wednesday night when all teams gather and the first matches are confirmed. Games are played on Thursday, Friday, and Saturday, concluding with a grand final dinner."
    },
    {
      question: "Are stick curlers allowed in IceCup?",
      answer: "Yes, stick curlers are allowed to participate in IceCup."
    },
    {
      question: "Where is IceCup held?",
      answer: "IceCup is held in the northern part of Iceland in a charming town called Akureyri."
    },
    {
      question: "How do I get to Akureyri?",
      answer: "Few airlines fly directly to Akureyri. The easiest way is to fly to Keflavík International Airport in the southwest part of Iceland, then either drive to Akureyri (a 6-hour drive) or take a domestic flight from Reykjavík Airport (1-hour drive from Keflavík, followed by a 45-minute flight)."
    }
  ];

const FAQ = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Frequently Asked Questions
        </Typography>
        {faqList.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}

export default FAQ;