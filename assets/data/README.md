# LinkedIn Data Update Instructions

This file contains instructions for populating your LinkedIn employment and education data.

## Quick Start

1. Visit your LinkedIn profile: https://www.linkedin.com/in/dmdhrumilmistry/
2. Copy your employment and education information
3. Update `assets/data/linkedin-data.json` with your details
4. Test locally before committing

## Example Data Format

Here's an example with realistic data:

```json
{
  "profile": {
    "name": "Dhrumil Mistry",
    "headline": "Software Engineer & Security Enthusiast",
    "profileUrl": "https://www.linkedin.com/in/dmdhrumilmistry/"
  },
  "employment": [
    {
      "company": "Tech Company Inc.",
      "position": "Senior Security Engineer",
      "location": "Remote",
      "startDate": "2023-06",
      "endDate": null,
      "current": true,
      "description": "Leading security initiatives and penetration testing for cloud infrastructure. Developing automated security tools and conducting security audits.",
      "logo": "https://via.placeholder.com/80?text=TC"
    },
    {
      "company": "Software Solutions Ltd.",
      "position": "Software Developer",
      "location": "Mumbai, India",
      "startDate": "2021-08",
      "endDate": "2023-05",
      "current": false,
      "description": "Developed full-stack web applications using Python, JavaScript, and cloud technologies. Implemented CI/CD pipelines and automated testing.",
      "logo": "https://via.placeholder.com/80?text=SS"
    }
  ],
  "education": [
    {
      "institution": "University of Technology",
      "degree": "Bachelor of Engineering",
      "field": "Electronics and Telecommunication",
      "startDate": "2019",
      "endDate": "2023",
      "current": false,
      "description": "Focused on embedded systems, networking protocols, and cybersecurity. Active member of robotics club. GPA: 3.8/4.0",
      "logo": "https://via.placeholder.com/80?text=UT"
    }
  ],
  "lastUpdated": "2024-01-04T00:00:00.000Z"
}
```

## Getting Company/University Logos

### Option 1: LinkedIn CDN
Right-click on the logo in LinkedIn and copy the image URL (if available)

### Option 2: Company Websites
Download logos from official company websites (check terms of use)

### Option 3: Use Placeholders
Keep the placeholder URLs until you find proper logos

### Option 4: Local Assets
Save logos to `assets/img/logos/` and reference them:
```json
"logo": "assets/img/logos/company-name.png"
```

## Date Formatting

- **Start/End Dates for Employment**: Use `YYYY-MM` format (e.g., "2023-06" for June 2023)
- **Start/End Dates for Education**: Use `YYYY` format (e.g., "2019")
- **Current Position**: Set `endDate` to `null` and `current` to `true`
- **Past Position**: Set `endDate` to actual date and `current` to `false`

## Tips

1. Keep descriptions concise (2-3 sentences)
2. Focus on key achievements and responsibilities
3. Use action verbs (Led, Developed, Implemented, etc.)
4. Test the JSON syntax at https://jsonlint.com/ before saving
5. Clear browser cache after updating to see changes immediately

## Privacy Note

The data file is public once committed. Only include information you're comfortable sharing publicly.

---

For more details, see [LINKEDIN_INTEGRATION.md](LINKEDIN_INTEGRATION.md)
