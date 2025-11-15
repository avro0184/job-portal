import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Drawer,
  TextField,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
// changed import to default
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";

export default function LearningResourcesPage() {
  // States for Resources and Categories
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const token = getToken()

  useEffect(() => {
    let mounted = true;
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("/resources/", "GET", token);
        if (!mounted) return;
        setResources(res.resources || []);
        // if API returns categories, set them too:
        if (res.categories) setCategories(res.categories);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchResources();

    return () => { mounted = false; };
  }, []); // run once on mount

  // ...rest of your component unchanged...
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openResourceDrawer = (resource) => {
    setSelectedResource(resource);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedResource(null);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Learning Resources
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
              fullWidth
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            placeholder="Search by title"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "action.active" }} />,
            }}
            fullWidth
          />
        </Box>
        <IconButton onClick={handleClearFilters}>
          <FilterListIcon sx={{ color: "primary.main" }} />
        </IconButton>
      </Box>

      {/* Resources List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#6754e8" }} />
        </Box>
      ) : resources.length > 0 ? (
        <Grid container spacing={2}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card sx={{ background: "#1a1a2e", color: "#fff", cursor: "pointer" }} onClick={() => openResourceDrawer(resource)}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    {resource.platform}
                  </Typography>
                  <Chip label={resource.level} color="primary" size="small" sx={{ marginBottom: 1 }} />
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.875rem" }}>
                    {resource.description?.slice(0, 100)}...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="textSecondary" align="center">
          No resources found
        </Typography>
      )}

      {/* Drawer for Resource Detail */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        {selectedResource && (
          <Box sx={{ p: 3, maxWidth: 400, width: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">{selectedResource.title}</Typography>
              <IconButton onClick={closeDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" color="textPrimary" sx={{ mb: 2 }}>
              {selectedResource.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Platform: {selectedResource.platform}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Cost: {selectedResource.cost_indicator}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Level: {selectedResource.level}
            </Typography>

            <Button variant="contained" color="primary" fullWidth>
              Start Learning
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}