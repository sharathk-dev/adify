import React, { useState } from "react";
import {
    Box,
    Input,
    Text,
    Button,
    VStack,
    Flex,
    Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { sendParkingInfo } from "../middlewares/api";

const ParkingInfo = () => {
    const [contactNumber, setContactNumber] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [reservationStartDate, setReservationStartDate] = useState("");
    const [reservationEndDate, setReservationEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!contactNumber || !licensePlate || !reservationStartDate || !reservationEndDate) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (new Date(reservationEndDate) <= new Date(reservationStartDate)) {
            setErrorMessage("End date must be after the start date.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        const payload = {
            contactNumber,
            licensePlate,
            reservationStartDate,
            reservationEndDate,
            userId: JSON.parse(localStorage.getItem("user"))?.userId || null
        };

        try {
            let token = JSON.parse(localStorage.getItem("user"))?.token || "";
            await sendParkingInfo(payload, token);
            navigate("/receipt");
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="#F9FAFB" px={4}>
            <Box maxW="md" w="full" p={8} bg="white" rounded="lg" boxShadow="xl" border="1px solid #E2E8F0">
                {/* Header Image */}
                <Image src="/images/logo.jpg" alt="Metropolis Logo" h="70px" maxW="80%" objectFit="contain" mx="auto" />

                <Text fontSize="xl" fontWeight="bold" mt={6} mb={4} color="gray.700" textAlign="center">
                    Welcome to xxx Garage!
                </Text>

                <VStack align="start" spacing={8} mt={4}>
                    {/* Contact Number */}
                    <Box w="full" mt={6}>
                        <Input
                            type="tel"
                            placeholder="Enter contact number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            maxLength={10}
                            variant="flushed"
                            _focus={{ borderColor: "gray.500" }}
                        />
                    </Box>

                    {/* License Plate */}
                    <Box w="full" mt={6}>
                        <Input
                            type="text"
                            placeholder="Enter license plate"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                            maxLength={8}
                            variant="flushed"
                            _focus={{ borderColor: "gray.500" }}
                        />
                    </Box>

                    {/* Reservation Start Date */}
                    <Box w="full" mt={6}>
                        <Input
                            type="datetime-local"
                            value={reservationStartDate}
                            onChange={(e) => setReservationStartDate(e.target.value)}
                            variant="flushed"
                            _focus={{ borderColor: "gray.500" }}
                        />
                    </Box>

                    {/* Reservation End Date */}
                    <Box w="full" mt={6}>
                        <Input
                            type="datetime-local"
                            value={reservationEndDate}
                            onChange={(e) => setReservationEndDate(e.target.value)}
                            variant="flushed"
                            _focus={{ borderColor: "gray.500" }}
                        />
                    </Box>

                    {errorMessage && <Text color="red.500" fontSize="sm">{errorMessage}</Text>}

                    {/* Submit Button */}
                    <Button
                        bg="#5F59FF"
                        color="white"
                        w="full"
                        size="lg"
                        fontWeight="bold"
                        _hover={{ bg: "gray.800" }}
                        onClick={handleSubmit}
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        mt={6}
                    >
                        Pay with Google Pay
                    </Button>

                </VStack>
            </Box>
        </Flex>
    );
};

export default ParkingInfo;
