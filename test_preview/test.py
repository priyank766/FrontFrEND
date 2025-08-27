import http.server
import socketserver
import os

PORT = 8000


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Request path: {self.path}")
        if self.path == "/web.html":
            # Serve web.html from the repo folder
            repo_path = r"C:\Users\Priyank\Documents\CODE\FrontFrEND\repo"
            file_path = os.path.join(repo_path, "web.html")
            print(f"Attempting to serve: {file_path}")
            try:
                with open(file_path, "rb") as f:
                    self.send_response(200)
                    self.send_header("Content-type", "text/html")
                    self.end_headers()
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.send_error(404, "File Not Found: %s" % self.path)
        else:
            # Serve other files from the current directory (test_preview)
            return http.server.SimpleHTTPRequestHandler.do_GET(self)


os.chdir(os.path.dirname(__file__))

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    print(f"Access the test page at http://localhost:{PORT}/index.html")
    httpd.serve_forever()
