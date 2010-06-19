/*=============================================================================
 Copyright (C) 2009-2010 Ryan Hope <rmh3093@gmail.com>

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 =============================================================================*/

#ifndef WIRC_H_
#define WIRC_H_

#define _GNU_SOURCE
#include <string.h>
#include <pthread.h>
#include <time.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <time.h>
#include <sys/timeb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <syslog.h>
#include <signal.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <dirent.h>
#include <fcntl.h>
#include <errno.h>
#include <sys/stat.h>
#include <netdb.h>
#include <regex.h>

#define IN_BUILDING_LIBIRC
typedef int socket_t;
typedef pthread_mutex_t port_mutex_t;

#include <PDL.h>
#include <libircclient.h>

#define DEFAULT_MAX_RETRIES 10
#define DEFAULT_PRE_RUN_USLEEP 0

int max_retries;
int pre_run_usleep;
int max_connections;

typedef enum {
	event_connect_, // 0
	event_nick_, // 1
	event_quit_, // 2
	event_join_, // 3
	event_part_, // 4
	event_mode_, // 5
	event_umode_, // 6
	event_topic_, // 7
	event_kick_, // 8
	event_channel_, // 9
	event_privmsg_, // 10
	event_notice_, // 11
	event_channel_notice_, // 12
	event_invite_, // 13
	event_ctcp_req_, // 14
	event_ctcp_rep_, // 15
	event_ctcp_action_, // 16
	event_unknown_, // 17
	event_numeric_, // 18
	auto_ping_, // 19
	event_dcc_chat_req_, // 20
	event_dcc_send_req_,
// 21
} irc_callbacks;

irc_callbacks_t callbacks;

typedef struct {
	int id;
	pthread_mutex_t mutex;
	pthread_t worker_thread;
	pthread_t ping_thread;
	irc_session_t *session;
	const char *server;
	const char *server_password;
	const char *nick;
	const char *username;
	const char *realname;
	const char *interface;
	const char *realServer;
	int estabilshed;
	int port;
	pthread_mutex_t ping_mutex;
	struct timeb ping;
} wIRCd_client_t;

wIRCd_client_t *servers;

typedef struct {
	FILE *file;
	int bitsIn;
	int size;
	int progress;
} dcc_send_t;

int plugin_client_init();
void plugin_start();
void plugin_cleanup();
PDL_Err plugin_initialize();
void setup_event_callbacks();
void handle_dcc_send_callback(irc_session_t * session, irc_dcc_t id,
		int status, void * ctx, const char * data, unsigned int length);
void handle_dcc_chat_callback(irc_session_t * session, irc_dcc_t id,
		int status, void * ctx, const char * data, unsigned int length);
void handle_dcc_sendfile_callback(irc_session_t * session, irc_dcc_t id,
		int status, void * ctx, const char * data, unsigned int length);
void handle_dcc_startchat_callback(irc_session_t * session, irc_dcc_t dcc_id,
		int status, void * ctx, const char * data, unsigned int length);

#endif /* WIRC_H_ */
