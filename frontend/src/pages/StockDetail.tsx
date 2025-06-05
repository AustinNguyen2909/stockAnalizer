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
                  <Grid container spacing={3}>
                    {stock.leadership.ceo && (
                      <Grid xs={12} md={6}>
                        <Typography variant="subtitle1">CEO</Typography>
                        <Typography>{stock.leadership.ceo}</Typography>
                      </Grid>
                    )}
                    {stock.leadership.cfo && (
                      <Grid xs={12} md={6}>
                        <Typography variant="subtitle1">CFO</Typography>
                        <Typography>{stock.leadership.cfo}</Typography>
                      </Grid>
                    )}
                    {stock.leadership.board_members && (
                      <Grid xs={12}>
                        <Typography variant="subtitle1">Board Members</Typography>
                        <List>
                          {stock.leadership.board_members.map((member, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={member} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    )}
                  </Grid>
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