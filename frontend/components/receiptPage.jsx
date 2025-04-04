import React, { useState, useEffect } from "react";
import { Box, Text, Image, Button, Flex } from "@chakra-ui/react";
import { userDetails, trackAdView } from "../middlewares/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReceiptPage = () => {
    const [isAdVisible, setIsAdVisible] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let data = JSON.parse(localStorage.getItem("user"));
                let userId = "";
                let token = "";
                if (data) {
                    userId = data.userId;
                    token = data.token;
                } else {
                    console.log("No user data found in localStorage.");
                }
                
                if (!userId) return;
                const userData = await userDetails(userId, token);
                if (userData) setUser(userData);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUser();
    }, []);

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

    const sendAdEvent = async (adId, isClicked) => {
        if (!user) return;
        const payload = {
            transactionId: user?.recommended_ads?.transactionId || "",
            isClicked,
            adId: adId || "",
            memberId: user?.recommended_ads?.memberId || "",
        };

        try {
            let token = "";
            if (JSON.parse(localStorage.getItem("user"))) {
                token = JSON.parse(localStorage.getItem("user")).token;
            } else {
                console.log("No user data found in localStorage.");
            }
            await trackAdView(payload, token);
            console.log(`Ad ${isClicked ? "click" : "view"} tracked successfully:`, payload);
        } catch (error) {
            console.error(`Error tracking ad ${isClicked ? "click" : "view"}:`, error);
        }
    };

    useEffect(() => {
        if (isAdVisible && user?.recommended_ads?.recommended_ads?.length > 0) {
            user.recommended_ads.recommended_ads.forEach(ad => sendAdEvent(ad.ad_id, 0));
        }
    }, [isAdVisible, user]);

    const ads = user?.recommended_ads?.recommended_ads || [];
    const defaultImage = "https://via.placeholder.com/400";

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
        <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bgGradient="linear(to-br, #2D0C57, #8A2387)">
            <Box bg="white" p={0} rounded="2xl" shadow="2xl" maxW="md" w="full" border="1px solid" borderColor="#5A189A" overflow="hidden">
                <Box bg="#7B2CBF" p={10} textAlign="center">
                    <Text fontSize="3xl" fontWeight="bold" color="white">Thank You!</Text>
                </Box>

                <Box p={8}>
                    <Text fontSize="xl" fontWeight="bold" textAlign="center" color="#7B2CBF">
                        Your Parking Receipt
                    </Text>
                    <Text color="gray.600" mt={2} textAlign="center">
                        Details of your parking at <b>PARKER STATION LOT</b>
                    </Text>

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

                    <Button w="full" bg="white" color="#5A189A" py={3} mt={5} mb={4} border="1px solid" borderColor="#5A189A"
                        boxShadow="inset 0px 4px 6px rgba(0, 0, 0, 0.2)" _hover={{ bg: "gray.100" }}>
                        Paid with Google Pay
                    </Button>

                    {isAdVisible && ads.length > 0 && (
                        <Box mt={4} w="full">
                            <Slider {...sliderSettings}>
                                {ads.map((ad, index) => (
                                    <Box key={index} position="relative">
                                        <a href={ad.target_url} target="_blank" rel="noopener noreferrer" onClick={() => sendAdEvent(ad.ad_id, 1)}>
                                            <Image src={ad.image_url || defaultImage} alt={`Ad ${index + 1}`} w="full" h={40} objectFit="cover" cursor="pointer" />
                                        </a>
                                        <Button size="s" position="absolute" top={1} right={1} color="gray.700" bg="gray.200"
                                            _hover={{ bg: "gray.300" }} _active={{ bg: "gray.400" }}
                                            onClick={() => {
                                                setIsAdVisible(false);
                                                sendAdEvent(ad.ad_id, 1);
                                            }}>
                                            ✕
                                        </Button>
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    )}

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
                        <Text fontSize="xs" color="gray.500" mt={2}>*Includes state and local taxes of $0.00</Text>
                    </Box>

                    <Button bg="#5A189A" color="white" mt={5} w="full" size="lg" fontWeight="bold" _hover={{ bg: "#7B2CBF" }}>
                        Find your receipt
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ReceiptPage;
