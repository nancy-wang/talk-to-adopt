export type FieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "currency";

export interface SelectOption {
  label: string;
  value: string;
}

export interface Condition {
  fieldId: string;
  op: "eq" | "neq" | "gt" | "lt" | "contains" | "filled";
  value?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: SelectOption[];
  condition?: Condition;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    patternMessage?: string;
  };
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  condition?: Condition;
}

export interface FormSchema {
  id: string;
  title: string;
  description: string;
  programName: string;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
  status: "draft" | "pending_review" | "approved" | "published";
}

export const HOUSING_CONNECT_TEMPLATE: FormSchema = {
  id: "housing-connect-template",
  title: "NYC Housing Connect Lottery Application",
  description:
    "Application for affordable housing through NYC Housing Connect.",
  programName: "NYC Housing Connect",
  sections: [
    {
      id: "applicant-info",
      title: "Primary Applicant Information",
      description: "Tell us about yourself.",
      fields: [
        {
          id: "first_name",
          label: "First name",
          type: "text",
          required: true,
          placeholder: "Your legal first name",
        },
        {
          id: "last_name",
          label: "Last name",
          type: "text",
          required: true,
          placeholder: "Your legal last name",
        },
        {
          id: "dob",
          label: "Date of birth",
          type: "date",
          required: true,
        },
        {
          id: "email",
          label: "Email address",
          type: "email",
          required: true,
          placeholder: "you@example.com",
        },
        {
          id: "phone",
          label: "Phone number",
          type: "tel",
          required: true,
          placeholder: "(212) 555-0100",
        },
      ],
    },
    {
      id: "address",
      title: "Current Address",
      description: "Where do you live now?",
      fields: [
        {
          id: "street",
          label: "Street address",
          type: "text",
          required: true,
          placeholder: "123 Main St, Apt 4B",
        },
        {
          id: "borough",
          label: "Borough",
          type: "select",
          required: true,
          options: [
            { label: "Manhattan", value: "manhattan" },
            { label: "Brooklyn", value: "brooklyn" },
            { label: "Queens", value: "queens" },
            { label: "Bronx", value: "bronx" },
            { label: "Staten Island", value: "staten_island" },
          ],
        },
        {
          id: "zip",
          label: "ZIP code",
          type: "text",
          required: true,
          placeholder: "10001",
          validation: {
            pattern: "^\\d{5}$",
            patternMessage: "Enter a 5-digit ZIP code",
          },
        },
      ],
    },
    {
      id: "household",
      title: "Household Composition",
      description:
        "Tell us about everyone who will live in the apartment with you.",
      fields: [
        {
          id: "household_size",
          label: "Total number of people in your household (including yourself)",
          type: "number",
          required: true,
          validation: { min: 1, max: 15 },
        },
        {
          id: "has_dependents",
          label: "Do any household members depend on you financially?",
          type: "radio",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "dependent_count",
          label: "How many dependents?",
          type: "number",
          required: true,
          condition: { fieldId: "has_dependents", op: "eq", value: "yes" },
          validation: { min: 1, max: 14 },
        },
      ],
    },
    {
      id: "income",
      title: "Household Income",
      description:
        "We need this to determine which apartments you may qualify for. Income limits vary by household size.",
      fields: [
        {
          id: "employment_status",
          label: "Current employment status",
          type: "select",
          required: true,
          options: [
            { label: "Employed full-time", value: "full_time" },
            { label: "Employed part-time", value: "part_time" },
            { label: "Self-employed", value: "self_employed" },
            { label: "Unemployed", value: "unemployed" },
            { label: "Retired", value: "retired" },
            { label: "Student", value: "student" },
            { label: "Disabled", value: "disabled" },
          ],
        },
        {
          id: "annual_income",
          label: "Total annual household income (before taxes)",
          type: "currency",
          required: true,
          helpText:
            "Include income from all household members. If unsure, estimate.",
        },
        {
          id: "income_sources",
          label: "Sources of income",
          type: "checkbox",
          required: false,
          options: [
            { label: "Wages / salary", value: "wages" },
            { label: "Self-employment", value: "self_employment" },
            { label: "Social Security", value: "social_security" },
            { label: "Pension", value: "pension" },
            { label: "Disability benefits", value: "disability" },
            { label: "Public assistance", value: "public_assistance" },
            { label: "Child support / alimony", value: "child_support" },
            { label: "Investment income", value: "investment" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },
    {
      id: "preferences",
      title: "Housing Preferences",
      description:
        "These preferences help match you with available apartments.",
      fields: [
        {
          id: "bedroom_size",
          label: "Apartment size needed",
          type: "select",
          required: true,
          options: [
            { label: "Studio", value: "studio" },
            { label: "1 bedroom", value: "1br" },
            { label: "2 bedrooms", value: "2br" },
            { label: "3 bedrooms", value: "3br" },
            { label: "4+ bedrooms", value: "4br" },
          ],
        },
        {
          id: "accessibility_needs",
          label: "Do you or anyone in your household need an accessible unit?",
          type: "radio",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "accessibility_type",
          label: "What type of accessibility features are needed?",
          type: "checkbox",
          required: false,
          condition: {
            fieldId: "accessibility_needs",
            op: "eq",
            value: "yes",
          },
          options: [
            { label: "Wheelchair accessible", value: "wheelchair" },
            { label: "Visual aids (e.g. Braille, audible signals)", value: "visual" },
            { label: "Hearing aids (e.g. visual alerts, amplification)", value: "hearing" },
          ],
        },
        {
          id: "community_preference",
          label: "Community district preference (if any)",
          type: "text",
          required: false,
          helpText:
            "Some lotteries give preference to current residents of the community district.",
        },
      ],
    },
    {
      id: "demographics",
      title: "Demographics (Optional)",
      description:
        "This information is used for fair housing reporting only. It does not affect your application.",
      fields: [
        {
          id: "race_ethnicity",
          label: "Race / ethnicity",
          type: "checkbox",
          required: false,
          options: [
            { label: "American Indian or Alaska Native", value: "native" },
            { label: "Asian", value: "asian" },
            { label: "Black or African American", value: "black" },
            { label: "Hispanic or Latino", value: "hispanic" },
            { label: "Native Hawaiian or Pacific Islander", value: "pacific" },
            { label: "White", value: "white" },
            { label: "Other", value: "other" },
            { label: "Prefer not to say", value: "prefer_not" },
          ],
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "draft",
};
