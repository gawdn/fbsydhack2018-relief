from http.server import HTTPServer, BaseHTTPRequestHandler
import ssl


httpd = HTTPServer(('localhost', 4443), BaseHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, 
        keyfile="keyssl.pem", 
        certfile='cert.pem', server_side=True)

print("Serving on localhost:4443")
httpd.serve_forever()