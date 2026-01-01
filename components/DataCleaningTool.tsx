"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Sparkles, Download } from "lucide-react";

type DataRow = Record<string, string | number>;

export default function DataCleaningTool() {
  const [data, setData] = useState<DataRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [cleanedCount, setCleanedCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setCleanedCount(0);

    Papa.parse(file, {
      header: true,
      dynamicTyping: false, // Keep as strings initially
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setHeaders(results.meta.fields || []);
          setData(results.data as DataRow[]);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the file format.");
      },
    });
  };

  const isNumericColumn = (columnData: (string | number)[]): boolean => {
    // Check if at least 50% of non-empty values are numeric
    const nonEmptyValues = columnData.filter(
      (val) => val !== null && val !== undefined && val !== ""
    );

    if (nonEmptyValues.length === 0) return false;

    const numericValues = nonEmptyValues.filter((val) => {
      const num = Number(val);
      return !isNaN(num) && isFinite(num);
    });

    return numericValues.length / nonEmptyValues.length >= 0.5;
  };

  const calculateMean = (values: number[]): number => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  const cleanData = () => {
    if (data.length === 0) return;

    let totalFilled = 0;
    const cleanedData = [...data];

    // Process each column
    headers.forEach((header) => {
      // Extract column values
      const columnValues = cleanedData.map((row) => row[header]);

      // Check if this is a numerical column
      if (isNumericColumn(columnValues)) {
        // Get all valid numeric values for mean calculation
        const numericValues = columnValues
          .filter((val) => val !== null && val !== undefined && val !== "" && val !== "null")
          .map((val) => Number(val))
          .filter((num) => !isNaN(num) && isFinite(num));

        if (numericValues.length > 0) {
          const mean = calculateMean(numericValues);
          const roundedMean = Math.round(mean * 100) / 100; // Round to 2 decimal places

          // Fill missing values with the mean
          cleanedData.forEach((row) => {
            const value = row[header];
            if (
              value === null ||
              value === undefined ||
              value === "" ||
              value === "null" ||
              (typeof value === "string" && value.toLowerCase() === "null")
            ) {
              row[header] = roundedMean;
              totalFilled++;
            }
          });
        }
      }
    });

    setData(cleanedData);
    setCleanedCount(totalFilled);
  };

  const downloadCleanedData = () => {
    if (data.length === 0) return;

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `cleaned_${fileName}`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Select a CSV file to view and clean your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose CSV File
            </Button>
            {fileName && (
              <span className="text-sm text-muted-foreground">
                {fileName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Preview</CardTitle>
                  <CardDescription>
                    {data.length} rows × {headers.length} columns
                    {cleanedCount > 0 && (
                      <span className="ml-2 text-green-600 font-semibold">
                        ({cleanedCount} values filled)
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={cleanData} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Fill Missing Values
                  </Button>
                  {cleanedCount > 0 && (
                    <Button onClick={downloadCleanedData} variant="secondary" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="font-bold">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((header, cellIndex) => {
                            const value = row[header];
                            const isEmpty =
                              value === null ||
                              value === undefined ||
                              value === "" ||
                              value === "null";

                            return (
                              <TableCell
                                key={cellIndex}
                                className={isEmpty ? "bg-red-50 text-red-400 italic" : ""}
                              >
                                {isEmpty ? "missing" : String(value)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {data.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No data loaded
            </p>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
