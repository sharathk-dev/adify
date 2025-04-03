import React, { useState, useEffect } from "react";
import { Box, Text, Image, Button, Flex } from "@chakra-ui/react";
import { userDetails,trackAdView } from "../middlewares/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReceiptPage = () => {
    const [isAdVisible, setIsAdVisible] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userDetails();
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUser();
    }, []);

    // Define the formatDate function
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Function to send API request for ad view or click
    const sendAdEvent = async (ad, isClicked) => {
        if (!user) return;

        const payload = {
            transactionId: user?.recommended_ads?.transactionId || "",
            isClicked,  // 0 for view, 1 for click
            adId: ad?.ad_id || "",
            memberId: user?.recommended_ads?.memberId || "",
        };

        try {
            await trackAdView(payload);
            console.log(`Ad ${isClicked ? "click" : "view"} tracked successfully:`, payload);
        } catch (error) {
            console.error(`Error tracking ad ${isClicked ? "click" : "view"}:`, error);
        }
    };

    // Call API when the ad is first shown
    useEffect(() => {
        if (isAdVisible && user?.recommended_ads?.recommended_ads?.length > 0) {
            user.recommended_ads.recommended_ads.forEach(ad => sendAdEvent(ad, 0));  // Track view event
        }
    }, [isAdVisible, user]);

    const ads = user?.recommended_ads?.recommended_ads || [];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: ads.length > 3,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
    };

    return (
        <Box
            minH="100vh"
            p={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgGradient="linear(to-br, #2D0C57, #8A2387)"
        >
            <Box
                bg="white"
                p={0}
                rounded="2xl"
                shadow="2xl"
                maxW="md"
                w="full"
                border="1px solid"
                borderColor="#5A189A"
                overflow="hidden"
            >
                {/* Top Section */}
                <Box
                    bgSize="cover"
                    bgPosition="center"
                    p={10}
                    textAlign="center"
                    position="relative"
                    bg="#7B2CBF"
                >
                    <Text fontSize="3xl" fontWeight="bold" color="white">
                        Thank You!
                    </Text>
                </Box>

                {/* Receipt Content */}
                <Box p={8}>
                    <Text fontSize="xl" fontWeight="bold" textAlign="center" color="#7B2CBF">
                        Your Parking Receipt
                    </Text>
                    <Text color="gray.600" mt={2} textAlign="center">
                        Details of your parking at <b>PARKER STATION LOT</b>
                    </Text>

                    {/* Parking Info */}
                    <Box mt={4} color="gray.700">
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">License Plate</Text>
                            <Text>{user?.recommended_ads?.licensePlate || "N/A"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Entered At</Text>
                            <Text>{user?.recommended_ads?.entryTime ? formatDate(user.recommended_ads.entryTime) : "N/A"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Exited At</Text>
                            <Text>{user?.recommended_ads?.exitTime ? formatDate(user.recommended_ads.exitTime) : "N/A"}</Text>
                        </Flex>
                    </Box>

                    {/* Payment Info */}
                    <Button
                        w="full"
                        bg="white"
                        color="#5A189A"
                        py={3}
                        mt={5}
                        mb={4}
                        border="1px solid"
                        borderColor="#5A189A"
                        boxShadow="inset 0px 4px 6px rgba(0, 0, 0, 0.2)"
                        _hover={{ bg: "gray.100" }}
                    >
                        Paid with Google Pay
                    </Button>

                    {/* Scrollable Ad Section */}
                    {isAdVisible && ads.length > 0 && (
                        <Box mt={4} w="full">
                            <Slider {...sliderSettings}>
                                {ads.map((ad, index) => (
                                    <Box key={index} position="relative">
                                        <a
                                            href={ad.target_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => sendAdEvent(ad, 1)}  // Track click event
                                        >
                                            <Image
                                                src={"https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/cca71160275449.5a46380807b12.jpg"}
                                                alt={`Advertisement ${index + 1}`}
                                                w="full"
                                                h={40}
                                                objectFit="cover"
                                                cursor="pointer"
                                            />
                                        </a>
                                        <Button
                                            size="s"
                                            position="absolute"
                                            top={1}
                                            right={1}
                                            color="gray.700"
                                            bg="gray.200"
                                            _hover={{ bg: "gray.300" }}
                                            _active={{ bg: "gray.400" }}
                                            onClick={() => {
                                                setIsAdVisible(false); // Close ad
                                                sendAdEvent(ad, 1); // Track click event
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    )}

                    {/* Pricing Details */}
                    <Box borderBottom="2px solid" borderColor="#5A189A" my={5} />
                    <Box color="gray.700">
                        <Flex justifyContent="space-between">
                            <Text>Parking</Text>
                            <Text>${user?.recommended_ads?.totalAmount || "0.00"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text>Service Fee</Text>
                            <Text>${user?.recommended_ads?.fee || "0.00"}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text>Discount</Text>
                            <Text>-$0.00</Text>
                        </Flex>
                        <Flex justifyContent="space-between" fontWeight="bold" color="#5A189A">
                            <Text>Total</Text>
                            <Text>${user?.recommended_ads?.paidAmount || "0.00"}</Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={2}>
                            *Includes state and local taxes of $0.00
                        </Text>
                    </Box>

                    {/* Close Session Button */}
                    <Button
                        bg="#5A189A"
                        color="white"
                        mt={5}
                        w="full"
                        size="lg"
                        fontWeight="bold"
                        _hover={{ bg: "#7B2CBF" }}
                    >
                        Find your receipt
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ReceiptPage;
