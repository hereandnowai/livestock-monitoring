
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDropzone } from 'react-dropzone-esm';
import { AnalysisResult, CsvData, GeneratedAlert } from '../types';
import { UploadIcon, FileIcon, SpinnerIcon, ExclamationCircleIcon, CheckCircleIcon, HeartIcon } from './icons';

const Analysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<CsvData[]>([]);
    const [csvString, setCsvString] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<string>('');

    const resetState = () => {
        setFile(null);
        setCsvData([]);
        setCsvString('');
        setAnalysisResult(null);
        setIsLoading(false);
        setError(null);
        setSelectedAnimal('');
    };

    const parseCSV = (fileContent: string): CsvData[] => {
        const rows = fileContent.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        const data = rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.trim());
            let entry: any = {};
            headers.forEach((header, index) => {
                const value = values[index];
                entry[header] = isNaN(Number(value)) || value === '' ? value : Number(value);
            });
            const timestamp = new Date(`${entry.Date} ${entry.Time}`).getTime();
            return { ...entry, timestamp } as CsvData;
        });
        return data;
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            resetState();
            const selectedFile = acceptedFiles[0];
            if (selectedFile.type !== 'text/csv') {
                setError("Invalid file type. Please upload a CSV file.");
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                try {
                    const parsedData = parseCSV(content);
                    setCsvData(parsedData);
                    setCsvString(content);
                    const uniqueAnimalIds = [...new Set(parsedData.map(d => d['Animal ID']))];
                    if (uniqueAnimalIds.length > 0) {
                        setSelectedAnimal(uniqueAnimalIds[0]);
                    }
                } catch(e) {
                    setError("Failed to parse CSV file. Please check the format.");
                    console.error(e);
                }
            };
            reader.onerror = () => {
                setError("Failed to read the file.");
            };
            reader.readAsText(selectedFile);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: { 'text/csv': ['.csv'] } });

    const handleAnalyze = async () => {
        if (!csvString) {
            setError("No data to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are an expert agricultural AI assistant from HERE AND NOW AI specializing in livestock health data analysis. I have uploaded a CSV file with the following data:
                ${csvString}
                The columns are: Animal ID, Date, Time, Body Temperature, Heart Rate, Activity Level, and Location.
                Please analyze this data and provide a response in JSON format. The root object should contain the following keys: "overallSummary", "animalSummaries", "anomalies", "alerts", and "suggestedActions".
                1.  **overallSummary**: A string providing a brief, high-level summary of the herd's health based on the provided data.
                2.  **animalSummaries**: An array of objects, one for each unique Animal ID. Calculate key health metrics. Each object should have: "animalId", "avgTemperature", "avgHeartRate", "avgActivityLevel", and a "healthStatus" (e.g., "Stable", "Concerning", "Action Required").
                3.  **anomalies**: An array of objects. Identify any significant outliers or anomalous readings. Each object should have: "animalId", "metric", "value", "timestamp" (combine date and time), and a "description" of why it's considered an anomaly.
                4.  **alerts**: An array of objects. Generate critical alerts for readings outside normal ranges (e.g., Temperature > 40°C or < 37.5°C, unusually high/low heart rate or activity). Each object should have: "animalId", "message", and "priority" ("High", "Medium", or "Low").
                5.  **suggestedActions**: An array of strings. Based on the analysis, provide a list of concrete, actionable interventions or steps for the farmer.
                Ensure the output is a valid JSON object.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17",
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });
            
            let jsonStr = response.text.trim();
            const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            const match = jsonStr.match(fenceRegex);
            if (match && match[2]) {
              jsonStr = match[2].trim();
            }
            const result = JSON.parse(jsonStr);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Analysis failed:", error);
            setError("Failed to analyze the data. The AI model might be busy. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const uniqueAnimalIds = useMemo(() => [...new Set(csvData.map(d => d['Animal ID']))], [csvData]);
    const chartData = useMemo(() => {
        return csvData
            .filter(d => d['Animal ID'] === selectedAnimal)
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(d => ({
                name: new Date(d.timestamp).toLocaleTimeString(),
                Temperature: d['Body Temperature'],
                'Heart Rate': d['Heart Rate'],
                'Activity Level': d['Activity Level'],
            }));
    }, [csvData, selectedAnimal]);
    
    const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
        switch(priority) {
            case 'High': return 'border-red-500 text-red-400';
            case 'Medium': return 'border-yellow-500 text-yellow-400';
            case 'Low': return 'border-sky-500 text-sky-400';
            default: return 'border-gray-500 text-gray-400';
        }
    }

    const combinedAlerts: GeneratedAlert[] = useMemo(() => {
        if (!analysisResult) return [];
        return [
            ...analysisResult.alerts,
            ...analysisResult.anomalies.map(a => ({
                animalId: a.animalId,
                message: a.description,
                priority: 'Medium' as const,
            }))
        ];
    }, [analysisResult]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">AI Data Analysis</h1>
            
            {!analysisResult && (
                <div className="bg-brand-card shadow-lg rounded-lg p-6 space-y-6">
                    <div 
                        {...getRootProps()} 
                        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-border hover:border-brand-primary/70'}`}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon className="h-12 w-12 mx-auto text-gray-500" />
                        <p className="mt-2 text-gray-300">
                            {isDragActive ? "Drop the file here..." : "Drag & drop a CSV file here, or click to select"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Expected columns: Animal ID, Date, Time, Body Temperature, Heart Rate, Activity Level, Location</p>
                    </div>

                    {file && (
                         <div className="flex items-center justify-between bg-brand-dark p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FileIcon className="h-6 w-6 text-brand-primary" />
                                <span className="text-gray-300">{file.name} ({ (file.size / 1024).toFixed(2) } KB) - {csvData.length} rows found.</span>
                            </div>
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isLoading || csvData.length === 0}
                                className="bg-brand-primary text-brand-secondary font-bold py-2 px-6 rounded-md hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isLoading && <SpinnerIcon className="h-5 w-5" />}
                                <span>{isLoading ? 'Analyzing...' : 'Analyze Data'}</span>
                            </button>
                        </div>
                    )}
                    
                    {isLoading && (
                        <div className="text-center text-gray-400">
                            <p>Your HERE AND NOW AI assistant is analyzing the data. This may take a moment...</p>
                        </div>
                    )}
                </div>
            )}
            
            {error && <div className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center space-x-3"><ExclamationCircleIcon className="h-6 w-6" /><p>{error}</p></div>}

            {analysisResult && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">Analysis Report for {file?.name}</h2>
                      <button onClick={resetState} className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-brand-secondary/80 transition-colors">
                          Analyze New File
                      </button>
                    </div>

                    <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Overall Summary</h3>
                        <p className="text-gray-400">{analysisResult.overallSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-brand-card p-4 rounded-lg shadow-lg h-[400px]">
                            <div className="flex justify-between items-center mb-4">
                               <h3 className="text-lg font-semibold text-gray-200">Data Visualization</h3>
                               <select 
                                   value={selectedAnimal}
                                   onChange={(e) => setSelectedAnimal(e.target.value)}
                                   className="bg-brand-dark border border-brand-border rounded-md px-3 py-1 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                               >
                                   {uniqueAnimalIds.map(id => <option key={id} value={id}>Animal {id}</option>)}
                               </select>
                            </div>
                            <ResponsiveContainer width="100%" height="88%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                                    <YAxis yAxisId="left" stroke="#ef4444" fontSize={12} tick={{ fill: '#ef4444' }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" fontSize={12} tick={{ fill: '#38bdf8' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                    <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                                    <Line yAxisId="left" type="monotone" name="Temp (°C)" dataKey="Temperature" stroke="#ef4444" dot={false} />
                                    <Line yAxisId="right" type="monotone" name="Heart Rate" dataKey="Heart Rate" stroke="#f472b6" dot={false} />
                                    <Line yAxisId="right" type="monotone" name="Activity" dataKey="Activity Level" stroke="#FFDF00" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-brand-card shadow-lg rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-200 mb-4">Suggested Actions</h3>
                                <ul className="space-y-3">
                                    {analysisResult.suggestedActions.map((action, i) => (
                                        <li key={i} className="flex items-start space-x-3">
                                            <CheckCircleIcon className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0"/>
                                            <span className="text-gray-400">{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">Alerts & Anomalies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combinedAlerts.map((item, i) => (
                                <div key={i} className={`border-l-4 p-4 bg-brand-dark/50 rounded-r-lg ${getPriorityColor(item.priority)}`}>
                                    <p className="font-semibold text-gray-200">
                                      {item.priority} Priority - Animal {item.animalId}
                                    </p>
                                    <p className="text-sm text-gray-400">{item.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">Animal Health Summaries</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {analysisResult.animalSummaries.map((summary) => (
                                <div key={summary.animalId} className="bg-brand-dark p-4 rounded-lg">
                                    <h4 className="font-bold text-gray-100 text-lg">Animal {summary.animalId}</h4>
                                    <p className={`text-sm font-semibold ${summary.healthStatus === 'Stable' ? 'text-green-400' : 'text-yellow-400'}`}>{summary.healthStatus}</p>
                                    <div className="mt-3 space-y-2 text-sm text-gray-400">
                                        <p>Avg Temp: <span className="font-medium text-gray-300">{summary.avgTemperature.toFixed(1)}°C</span></p>
                                        <p>Avg Heart Rate: <span className="font-medium text-gray-300">{summary.avgHeartRate.toFixed(0)} bpm</span></p>
                                        <p>Avg Activity: <span className="font-medium text-gray-300">{summary.avgActivityLevel.toFixed(0)}%</span></p>
                                    </div>
                                </div>
                           ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analysis;
