import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { fetchStocks } from '../features/stocks/stocksSlice';
import type { RootState, AppDispatch } from '../store';
import type { Stock } from '../types/stock';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: stocks, total, page, limit } = useSelector(
    (state: RootState) => state.stocks
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchStocks({ page, limit }));
  }, [dispatch, page, limit]);

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(fetchStocks({ page: newPage + 1, limit }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(fetchStocks({ page: 1, limit: parseInt(event.target.value, 10) }));
  };

  const filteredStocks = stocks.filter(
    (stock: Stock) =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Nghìn tỷ`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Tỷ`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Triệu`;
    return formatNumber(num);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Stock Dashboard
              </Typography>
              <TextField
                fullWidth
                label="Search Stocks"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticker</TableCell>
                      <TableCell>Company Name</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Market Cap</TableCell>
                      <TableCell align="right">P/E Ratio</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStocks.map((stock: Stock) => (
                      <TableRow key={stock.ticker}>
                        <TableCell>{stock.ticker}</TableCell>
                        <TableCell>{stock.company_name}</TableCell>
                        <TableCell align="right">
                          {formatNumber(stock.price)}
                        </TableCell>
                        <TableCell align="right">
                          {formatMarketCap(stock.market_cap)}
                        </TableCell>
                        <TableCell align="right">
                          {stock.pe_ttm?.toFixed(2) || 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => navigate(`/stocks/${stock.ticker}`)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={total}
                  rowsPerPage={limit}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 