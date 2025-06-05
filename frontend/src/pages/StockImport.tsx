import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { stockService } from '../services/stockService';

const StockImport = () => {
  const [jsonData, setJsonData] = useState('');
  const [updateExisting, setUpdateExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    created: number;
    updated: number;
    errors: Array<{ ticker: string; error: string }>;
  } | null>(null);

  const handleImport = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = JSON.parse(jsonData);
      if (!data.stocks || !Array.isArray(data.stocks)) {
        throw new Error('Invalid JSON format. Expected { stocks: [] }');
      }

      const response = await stockService.importStocks(data, updateExisting);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import stocks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Import Stocks
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Paste your JSON data in the format:
            <pre>
              {JSON.stringify(
                {
                  stocks: [
                    {
                      ticker: 'AAPL',
                      company_name: 'Apple Inc.',
                      price: 150.25,
                      market_cap: 2500000000000,
                    },
                  ],
                },
                null,
                2
              )}
            </pre>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            label="JSON Data"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateExisting}
                onChange={(e) => setUpdateExisting(e.target.checked)}
              />
            }
            label="Update existing stocks"
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleImport}
              disabled={loading || !jsonData}
            >
              {loading ? 'Importing...' : 'Import'}
            </Button>
          </Box>
          {result && (
            <Alert
              severity={result.errors.length > 0 ? 'warning' : 'success'}
              sx={{ mt: 2 }}
            >
              Import completed: {result.created} created, {result.updated} updated
              {result.errors.length > 0 && (
                <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                  {result.errors.map((err, index) => (
                    <li key={index}>
                      {err.ticker}: {err.error}
                    </li>
                  ))}
                </Box>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockImport; 