import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchStockByTicker } from '../features/stocks/stocksSlice';
import type { RootState, AppDispatch } from '../store';
import type { Stock } from '../types/stock';

const StockDetail = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedStock: stock, loading, error } = useSelector(
    (state: RootState) => state.stocks as { selectedStock: Stock | null; loading: boolean; error: string | null }
  );

  useEffect(() => {
    if (ticker) {
      dispatch(fetchStockByTicker(ticker));
    }
  }, [dispatch, ticker]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stock) {
    return (
      <Box p={3}>
        <Alert severity="info">Stock not found</Alert>
      </Box>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return formatNumber(num);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {stock.company_name} ({stock.ticker})
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Key Metrics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Price"
                        secondary={formatNumber(stock.price)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Market Cap"
                        secondary={formatMarketCap(stock.market_cap)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="P/E Ratio (TTM)"
                        secondary={stock.pe_ttm?.toFixed(2) || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Forward P/E"
                        secondary={stock.forward_pe?.toFixed(2) || 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Additional Metrics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="EPS (TTM)"
                        secondary={stock.eps_ttm?.toFixed(2) || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Book Value per Share"
                        secondary={stock.bvps?.toFixed(2) || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Price to Book"
                        secondary={stock.pb?.toFixed(2) || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Beta"
                        secondary={stock.beta?.toFixed(2) || 'N/A'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              {stock.leadership && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Leadership
                  </Typography>
                  {stock.leadership.ceo && typeof stock.leadership.ceo === 'object' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">CEO</Typography>
                      <Typography>{stock.leadership.ceo.name || ''}</Typography>
                      <Typography>{stock.leadership.ceo.education || ''}</Typography>
                      <Typography>{stock.leadership.ceo.position || ''}</Typography>
                      {!!stock.leadership.ceo.birth_year && <Typography>{"Sinh năm:" + stock.leadership.ceo.birth_year}</Typography>}
                    </Grid>
                  ) : typeof stock.leadership.ceo === 'string' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">CEO</Typography>
                      <Typography>{stock.leadership.ceo}</Typography>
                    </Grid>
                  ) : null}
                  {stock.leadership.chairman && typeof stock.leadership.chairman === 'object' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Chairman</Typography>
                      <Typography>{stock.leadership.chairman.name || ''}</Typography>
                      <Typography>{stock.leadership.chairman.education || ''}</Typography>
                      <Typography>{stock.leadership.chairman.position || ''}</Typography>
                      {!!stock.leadership.chairman.birth_year && <Typography>{"Sinh năm:" + stock.leadership.chairman.birth_year}</Typography>}
                    </Grid>
                  ) : typeof stock.leadership.chairman === 'string' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Chairman</Typography>
                      <Typography>{stock.leadership.chairman}</Typography>
                    </Grid>
                  ) : null}
                  {stock.leadership.chairwoman && typeof stock.leadership.chairwoman === 'object' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Chairwoman</Typography>
                      <Typography>{stock.leadership.chairwoman.name || ''}</Typography>
                      <Typography>{stock.leadership.chairwoman.education || ''}</Typography>
                      <Typography>{stock.leadership.chairwoman.position || ''}</Typography>
                      {!!stock.leadership.chairwoman.birth_year && <Typography>{"Sinh năm:" + stock.leadership.chairwoman.birth_year}</Typography>}
                    </Grid>
                  ) : typeof stock.leadership.chairwoman === 'string' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Chairwoman</Typography>
                      <Typography>{stock.leadership.chairwoman}</Typography>
                    </Grid>
                  ) : null}
                  {stock.leadership.vice_chairman && typeof stock.leadership.vice_chairman === 'object' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Vice Chairman</Typography>
                      <Typography>{stock.leadership.vice_chairman.name || ''}</Typography>
                      <Typography>{stock.leadership.vice_chairman.education || ''}</Typography>
                      <Typography>{stock.leadership.vice_chairman.position || ''}</Typography>
                      {!!stock.leadership.vice_chairman.birth_year && <Typography>{"Sinh năm:" + stock.leadership.vice_chairman.birth_year}</Typography>}
                    </Grid>
                  ) : typeof stock.leadership.vice_chairman === 'string' ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Vice Chairman</Typography>
                      <Typography>{stock.leadership.vice_chairman}</Typography>
                    </Grid>
                  ) : null}
                  {stock.leadership.deputy_ceos?.length ? (
                    <Grid xs={12} md={6}>
                      <Typography variant="h6">Deputy CEO</Typography>
                      {stock.leadership.deputy_ceos.map((item) => (
                        <Typography>{item || ''}</Typography>
                      ))}
                    </Grid>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDetail; 