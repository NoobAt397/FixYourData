import DataCleaningTool from "@/components/DataCleaningTool";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            FixMyData
          </h1>
          <p className="text-slate-600">
            Upload a CSV file, view your data, and automatically fill missing values
          </p>
        </div>
        <DataCleaningTool />
      </div>
    </main>
  );
}
