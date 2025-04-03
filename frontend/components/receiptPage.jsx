import React, { useState } from "react";
import { Box, Text, Image, Button, Flex } from "@chakra-ui/react";

const ReceiptPage = () => {
    const [isAdVisible, setIsAdVisible] = useState(true);

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
                {/* Top Section with Background Image */}
                <Box
                    bgImage="url('/images/j.png')" // Replace with actual image path
                    bgSize="cover"
                    bgPosition="center"
                    p={10}
                    textAlign="center"
                    position="relative"
                    _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bg: "#7B2CBF", // Dark overlay for readability
                    }}
                >
                    <Text fontSize="3xl" fontWeight="bold" color="white" position="relative" zIndex={1}>
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
                            <Text>7136880</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Entered At</Text>
                            <Text>Mar 26, 09:11 AM</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                            <Text fontWeight="bold">Exited At</Text>
                            <Text>Mar 26, 10:01 AM</Text>
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
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        Paid with Google Pay
                    </Button>

                    {/* Ad Section */}
                    {isAdVisible && (
                        <Box
                            bg="gray.100"
                            rounded="md"
                            textAlign="center"
                            position="relative"
                            color="black"
                            shadow="md"
                            w="full"
                            h={32}
                            overflow="hidden"
                        >
                            <Box position="relative" w="full" h="full">
                                <Image src="/images/buger.jpg" alt="Ad" w="full" h="full" objectFit="cover" />
                                <Button
                                    size="s"
                                    position="absolute"
                                    top={1}
                                    right={1}
                                    color="gray.700"
                                    bg="gray.200"
                                    _hover={{ bg: "gray.300" }}
                                    _active={{ bg: "gray.400" }}
                                    onClick={() => setIsAdVisible(false)}
                                >
                                    ✕
                                </Button>
                                <Button
                                    bg="rgba(0,0,0,0.4)"
                                    color="white"
                                    size="xs"
                                    _hover={{ bg: "#000", color: "white" }}
                                    position="absolute"
                                    bottom={2}
                                    left="50%"
                                    transform="translateX(-50%)"
                                    fontWeight="bold"
                                >
                                    Redeem
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Pricing Details */}
                    <Box borderBottom="2px solid" borderColor="#5A189A" my={5} />
                    <Box color="gray.700">
                        <Flex justifyContent="space-between"><Text>Parking</Text><Text>$4.00</Text></Flex>
                        <Flex justifyContent="space-between"><Text>Service Fee</Text><Text>$0.00</Text></Flex>
                        <Flex justifyContent="space-between"><Text>Discount</Text><Text>-$0.00</Text></Flex>
                        <Flex justifyContent="space-between" fontWeight="bold" color="#5A189A">
                            <Text>Total</Text><Text>$4.00</Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={2}>*Includes state and local taxes of $0.00</Text>
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
                        Session Closed
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ReceiptPage;
