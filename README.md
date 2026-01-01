# FixMyData

A client-side data cleaning tool built with Next.js that allows users to upload messy CSV files, view them in a clean table, and automatically fill missing values in numerical columns.

## Features

- **CSV Upload**: Upload CSV files directly in your browser
- **Data Visualization**: View your data in a clean, scrollable table
- **Smart Data Cleaning**: Automatically detect numerical columns and fill missing values with column means
- **Download Cleaned Data**: Export your cleaned data as a new CSV file
- **Missing Value Detection**: Visual indicators for missing or null values

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Shadcn/UI**: Beautiful, accessible UI components
- **Papaparse**: Powerful CSV parser
- **Lucide React**: Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FixYourData
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Choose CSV File" to upload a CSV file
2. View your data in the table - missing values are highlighted in red
3. Click "Fill Missing Values" to automatically clean the data
   - The tool detects numerical columns
   - Replaces null, empty, or "null" values with the column mean
4. Download the cleaned data using the "Download" button

## How It Works

The `cleanData()` function:

1. Iterates through each column in the dataset
2. Determines if a column is numerical (at least 50% of non-empty values are numbers)
3. Calculates the mean of all valid numerical values in that column
4. Replaces missing values (`null`, empty strings, or "null") with the calculated mean (rounded to 2 decimal places)

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
