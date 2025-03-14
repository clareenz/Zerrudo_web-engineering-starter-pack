import socket
import json
import threading

# Physical Layer
class PhysicalLayer:
    def __init__(self):
        self.medium = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def to_bits(self, data):
        return ''.join(format(byte, '08b') for byte in data.encode('utf-8'))

    def from_bits(self, bit_data):
        bytes_data = [bit_data[i:i + 8] for i in range(0, len(bit_data), 8)]
        return ''.join([chr(int(b, 2)) for b in bytes_data])

    def send(self, frame, host, port):
        self.medium.connect((host, port))
        json_data = json.dumps(frame)
        bit_stream = self.to_bits(json_data)  # Convert JSON to bits
        print(f"[Physical Layer] Sending Bit Stream: {bit_stream}")
        self.medium.sendall(bit_stream.encode())
        self.medium.close()

    def receive(self):
        listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        listener.bind(("localhost", 8080))
        listener.listen(1)
        print("[Physical Layer] Listening on port 8080...")

        conn, _ = listener.accept()
        bit_data = conn.recv(4096).decode()
        print(f"[Physical Layer] Received Bit Stream: {bit_data}")
        json_data = self.from_bits(bit_data)  # Convert bits to JSON
        conn.close()
        listener.close()
        return json.loads(json_data)

# Data Link Layer
class DataLinkLayer:
    def create_frame(self, packet):
        frame = {
            "mac_address": "00:1A:2B:3C:4D:5E",
            "payload": packet
        }
        print(f"[Data Link Layer] Processing Data: {frame}")
        return frame

    def process_frame(self, frame):
        print(f"[Data Link Layer] Received Frame: {frame}")
        return frame["payload"]

# Network Layer
class NetworkLayer:
    def add_ip_packet(self, segment):
        packet = {
            "ip_address": "192.168.1.1",
            "payload": segment
        }
        print(f"[Network Layer] Processing Data: {packet}")
        return packet

    def process_packet(self, packet):
        print(f"[Network Layer] Received Packet: {packet}")
        return packet["payload"]

# Transport Layer
class TransportLayer:
    def add_tcp_segment(self, data):
        segment = {
            "sequence_number": 1,
            "payload": data
        }
        print(f"[Transport Layer] Processing Data: {segment}")
        return segment

    def process_segment(self, segment):
        print(f"[Transport Layer] Received Segment: {segment}")
        return segment["payload"]

# Session Layer
class SessionLayer:
    def manage_session(self, data):
        print(f"[Session Layer] Managing Data: {data}")
        return {"payload": data}

    def handle_session(self, session_data):
        print(f"[Session Layer] Handling Data: {session_data}")
        return session_data["payload"]

# Presentation Layer
class PresentationLayer:
    def encode(self, data):
        print(f"[Presentation Layer] Encoding Data: {data}")
        return {"payload": data}

    def decode(self, data):
        print(f"[Presentation Layer] Decoding Data: {data}")
        return data["payload"]

# Application Layer
class ApplicationLayer:
    def create_request(self, message):
        print(f"[Application Layer] Creating Request: {message}")
        return {
            "method": "GET",
            "path": "/",
            "body": message
        }

    def process_request(self, request):
        print(f"[Application Layer] Received Request: {request}")
        print(f"Message: {request["body"]}")


if __name__ == "__main__":
    physical = PhysicalLayer()
    data_link = DataLinkLayer()
    network = NetworkLayer()
    transport = TransportLayer()
    session = SessionLayer()
    presentation = PresentationLayer()
    application = ApplicationLayer()

    #Message to Send
    message = "Hello, World!"


    # Start the receiver in a separate thread
    def run_receiver():
        received_frame = physical.receive()
        received_packet = data_link.process_frame(received_frame)
        received_segment = network.process_packet(received_packet)
        received_session_data = transport.process_segment(received_segment)
        decoded_session_data = session.handle_session(received_session_data)
        decoded_request = presentation.decode(decoded_session_data)
        application.process_request(decoded_request)

    receiver_thread = threading.Thread(target=run_receiver)
    receiver_thread.start()

    # Simulate sending a message
   
    request = application.create_request(message)
    encoded_data = presentation.encode(request)
    session_data = session.manage_session(encoded_data)
    segment = transport.add_tcp_segment(session_data)
    packet = network.add_ip_packet(segment)
    frame = data_link.create_frame(packet)

    print("\n Sending Data\n")
    physical.send(frame, "localhost", 8080)
    
    receiver_thread.join()
