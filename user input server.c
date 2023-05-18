#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdarg.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#ifdef _WIN32
	#include <windows.h>
#else
	#include <X11/Xlib.h>
	#include <X11/extensions/XTest.h>
#endif

#define PORT 49069

void cthread(void (*func)(void)) {
  pthread_t thread;
  pthread_create(&thread, NULL, func, NULL);
  pthread_join(thread, NULL);
}

float rtime(float tmin, float tmax) {
	return (float)rand() / RAND_MAX * ((tmax * 1000000) - (tmin * 1000000)) + (tmin * 1000000);
}

void mmove(int x, int y) {
	#ifdef _WIN32
		SetCursorPos(100, 100);
	#else
		Display *display = XOpenDisplay(NULL);
		Window root = XDefaultRootWindow(display);
	#endif
}

void lclick() {
	cthread(void func() {
		srand(time(NULL));
		float clickTime = rtime(0.06,0.7);
		#ifdef _WIN32
			POINT mPos;
			GetCursorPos(&mPos);
			mouse_event(MOUSEEVENTF_LEFTDOWN, mPos.x, mPos.y, 0, 0);
			usleep(clickTime);
			mouse_event(MOUSEEVENTF_LEFTUP, mPos.x, mPos.y, 0, 0);
		#else
			Display *display = XOpenDisplay(NULL);
			XTestFakeButtonEvent(display, Button1, True, 0);
			usleep(clickTime);
			XTestFakeButtonEvent(display, Button1, False, 0);
		#endif
	});
}

void rclick() {
	cthread(void func() {
		srand(time(NULL));
		float clickTime = rtime(0.06,0.7);
		#ifdef _WIN32
			POINT mPos;
			GetCursorPos(&mPos);
			mouse_event(MOUSEEVENTF_LEFTDOWN, mPos.x, mPos.y, 0, 0);
			usleep(clickTime);
			mouse_event(MOUSEEVENTF_LEFTUP, mPos.x, mPos.y, 0, 0);
		#else
			Display *display = XOpenDisplay(NULL);
			XTestFakeButtonEvent(display, Button2, True, 0);
			usleep(clickTime);
			XTestFakeButtonEvent(display, Button2, False, 0);
		#endif
	});
}

void process_input(char* input) {
	printf("Received input: %s\n", input);
}

int main() {
	int server_fd = socket(AF_INET, SOCK_STREAM, 0);
	struct sockaddr_in address = {0};
	address.sin_family = AF_INET;
	address.sin_addr.s_addr = INADDR_ANY;
	address.sin_port = htons(PORT);
	bind(server_fd, (struct sockaddr *)&address, sizeof(address));
	listen(server_fd, 3);

	while (1) {
		int new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen);
		char buffer[1024] = {0};
		while (read(new_socket, buffer, 1024) > 0) {
			process_input(buffer);
		}
		close(new_socket);
	}
	return 0;
}