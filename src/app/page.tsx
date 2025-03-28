'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OcrResult {
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  rate: number;
}

interface ApiResponse {
  result: {
    errcode: number;
    errmsg?: string;
    height: number;
    width: number;
    imgpath: string;
    ocr_response: OcrResult[];
  };
}

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      setResult(null);
      setPreviewUrl('');
      const base64 = await toBase64(file);
      setPreviewUrl(URL.createObjectURL(file));
      await processImage(base64);
    } catch (err) {
      setError('Error processing file');
      console.error(err);
    } finally {
      setLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    };
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;

    try {
      setLoading(true);
      setError('');
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      setPreviewUrl(imageUrl);
      const base64 = await toBase64(blob as File);
      await processImage(base64);
    } catch (err) {
      setError('Error processing URL');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processImage = async (base64: string) => {
    try {
      // Validate input
      if (!base64) {
        throw new Error('No image data provided');
      }

      const response = await fetch('/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          errmsg: `HTTP Error: ${response.status} ${response.statusText}`
        }));
        throw new Error(errorData.errmsg || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Validate API response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response format');
      }

      // Type check and validation
      const apiResponse = data as ApiResponse;
      if (typeof apiResponse.result?.errcode !== 'number') {
        throw new Error('Invalid API response: missing or invalid error code');
      }

      if (apiResponse.result.errcode !== 0) {
        console.error('OCR API Error:', apiResponse.result);
        throw new Error(
          apiResponse.result.errmsg ||
          `OCR processing failed (Error code: ${apiResponse.result.errcode})`
        );
      }

      // Validate required fields
      if (!Array.isArray(apiResponse.result.ocr_response)) {
        throw new Error('Invalid API response: missing OCR results');
      }

      setResult(apiResponse);
    } catch (err) {
      console.error('OCR Processing Error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unexpected error during OCR processing'
      );
      setResult(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">

      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>OCR Image Recognition</CardTitle>
          <CardDescription>Upload an image or provide a URL to extract text using OCR technology</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div
                className="grid w-full items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors cursor-pointer"
                onPaste={async (e) => {
                  e.preventDefault();
                  const items = e.clipboardData.items;
                  const imageItem = Array.from(items).find(item => item.type.startsWith('image/'));
                  if (!imageItem) return;
                  
                  try {
                    setLoading(true);
                    setError('');
                    setResult(null);
                    setPreviewUrl('');
                    const file = imageItem.getAsFile();
                    if (!file) return;
                    const base64 = await toBase64(file);
                    setPreviewUrl(URL.createObjectURL(file));
                    await processImage(base64);
                  } catch (err) {
                    setError('Error processing pasted image');
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary');
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary');
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  try {
                    setLoading(true);
                    setError('');
                    setResult(null);
                    setPreviewUrl('');
                    const base64 = await toBase64(file);
                    setPreviewUrl(URL.createObjectURL(file));
                    await processImage(base64);
                  } catch (err) {
                    setError('Error processing file');
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Upload image using one of the following methods:</p>
                  <p className="text-sm text-muted-foreground">1. Click the button below to select a file</p>
                  <p className="text-sm text-muted-foreground">2. Drag and drop an image here</p>
                  <p className="text-sm text-muted-foreground">3. Paste an image from clipboard</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="picture">Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="w-full max-w-sm"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={loading}
                />
                <Button onClick={handleUrlSubmit} disabled={loading || !imageUrl}>
                  Process
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {loading && <div className="mt-4">Processing...</div>}
          {error && <div className="mt-4 text-red-500">{error}</div>}

          {previewUrl && !result && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="border rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Results</h3>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3 truncate" title="Recognized Text">Text</TableHead>
                    <TableHead className="w-1/4 text-center" title="Position Coordinates">Position</TableHead>
                    <TableHead className="w-1/4 text-center" title="Size Dimensions">Size</TableHead>
                    <TableHead className="w-1/6 text-center" title="Recognition Confidence">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.result.ocr_response.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="max-w-xs truncate hover:whitespace-normal hover:text-clip" title={item.text}>{item.text}</TableCell>
                      <TableCell className="text-center">({item.left}, {item.top})</TableCell>
                      <TableCell className="text-center">{item.right - item.left} × {item.bottom - item.top}</TableCell>
                      <TableCell className="text-center">{(item.rate * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="relative border rounded-lg overflow-hidden" style={{ height: `${result.result.height}px`, width: `${result.result.width}px` }}>
                <img src={previewUrl} alt="Original" className="absolute top-0 left-0 w-full h-full object-contain" />
                {result.result.ocr_response.map((item, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-blue-500 bg-blue-50/30 hover:bg-blue-100/50 transition-colors"
                    style={{
                      left: `${item.left}px`,
                      top: `${item.top}px`,
                      width: `${item.right - item.left}px`,
                      height: `${item.bottom - item.top}px`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 text-sm bg-white/80 px-1 rounded">
                      {item.text} ({(item.rate * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
