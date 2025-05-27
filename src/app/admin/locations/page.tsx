"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Table, message, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/app/lib/client/apiAdmin";
import SearchBar from "@/app/components/admin/searchbar/SearchBar";
import DeleteLocationModal from "@/app/components/admin/locations/DeleteLocationModal/DeleteLocationModal";
import { getLocationTableColumns } from "@/app/components/admin/locations/getLocationTableColumns/getLocationTableColumns";
import LocationFormModal from "@/app/components/admin/locations/LocationFormModal/LocationFormModal";
import { Location } from "@/app/types/location/location";

const LocationPage = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations", page],
    queryFn: async () => {
      const response = await http.get<Location[]>(`/vi-tri?pageIndex=${page}&pageSize=50`);
      return response;
    },
    staleTime: 1000 * 60 * 10,
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, updatedLocation }: { id: number; updatedLocation: Location }) =>
      http.put(`/vi-tri/${id}`, updatedLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      message.success("Location updated successfully");
      setIsEditModalOpen(false);
      setCurrentLocation(null);
    },
    onError: () => {
      message.error("Failed to update location");
    },
  });

  const addLocationMutation = useMutation({
    mutationFn: (newLocation: Omit<Location, "id">) => http.post(`/vi-tri`, newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      message.success("Location created successfully");
      setIsAddModalOpen(false);
      setCurrentLocation(null);
    },
    onError: () => {
      message.error("Failed to create location");
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (id: number) => http.delete(`/vi-tri/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      message.success("Location deleted successfully");
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    },
    onError: () => {
      message.error("Failed to delete location");
    },
  });

  const filteredLocations = useMemo(() => {
    if (!searchText) return locations;
    const searchValue = searchText.trim().toLowerCase();
    return locations.filter(
      (location) =>
        location.id.toString().includes(searchValue) ||
        location.tenViTri.toLowerCase().includes(searchValue) ||
        location.tinhThanh.toLowerCase().includes(searchValue) ||
        location.quocGia.toLowerCase().includes(searchValue)
    );
  }, [locations, searchText]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleEdit = useCallback((location: Location) => {
    setCurrentLocation(location);
    setIsEditModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setCurrentLocation({
      id: 0,
      tenViTri: "",
      tinhThanh: "",
      quocGia: "",
      hinhAnh: "",
    });
    setIsAddModalOpen(true);
  }, []);

  const handleDelete = useCallback((locationId: number) => {
    const location = locations.find((l) => l.id === locationId) || null;
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  }, [locations]);

  const handleConfirmDelete = useCallback(() => {
    if (locationToDelete) {
      deleteLocationMutation.mutate(locationToDelete.id);
    }
  }, [locationToDelete, deleteLocationMutation]);

  const handleFormSubmit = useCallback(
    (values: Location) => {
      if (currentLocation?.id) {
        updateLocationMutation.mutate({ id: currentLocation.id, updatedLocation: values });
      } else {
        const { id, ...newLocation } = values;
        addLocationMutation.mutate(newLocation);
      }
    },
    [currentLocation, updateLocationMutation, addLocationMutation]
  );

  const columns = useMemo(
    () => getLocationTableColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Location Management</h1>
        <div className="flex justify-end items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAdd}
            style={{ backgroundColor: "#fe6b6e", borderColor: "#fe6b6e", fontSize: "16px", padding: "20px" }}
          >
            Add Location
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredLocations}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
        rowClassName={() => "hover:bg-gray-50"}
      />
      <LocationFormModal
        isOpen={isEditModalOpen || isAddModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsAddModalOpen(false);
          setCurrentLocation(null);
        }}
        currentLocation={currentLocation}
        onSubmit={handleFormSubmit}
        isSubmitting={updateLocationMutation.isPending || addLocationMutation.isPending}
      />
      <DeleteLocationModal
        isOpen={isDeleteModalOpen}
        location={locationToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLocationToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default LocationPage;
