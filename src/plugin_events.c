/*=============================================================================
 Copyright (C) 2009 Ryan Hope <rmh3093@gmail.com>

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

#include "wIRC.h"

void process_event(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count,
		irc_callbacks type) {

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);

	client->estabilshed = 1;

	char buf[512];
	int cnt;
	int i;
	int j = 0;

	for (cnt = 0; cnt < count; cnt++) {
		if (cnt)
			buf[j++] = ',';

		buf[j++] = '"';

		for (i = 0; i < strlen(params[cnt]); i++) {
			if (params[cnt][i] == '"' || params[cnt][i] == '\\')
				buf[j++] = '\\';

			buf[j++] = params[cnt][i];
		}

		buf[j++] = '"';
	}

	buf[j] = '\0';

	int len = 0;
	char *parms = 0;
	len = asprintf(&parms, "[%s]", buf);

	char *id = 0;
	asprintf(&id, "%d", client->id);

	const char *payload[5];
	payload[0] = id;
	payload[1] = event;
	payload[2] = origin ? origin : "";
	payload[3] = parms;
	if (type == event_connect_) {
		payload[4] = inet_ntoa(session->local_addr);
	} else {
		payload[4] = 0;
	}

	//syslog(LOG_INFO, "irc-event: %s %s %s %s", payload[0], payload[1], payload[2], payload[3]);

	switch (type) {
	case event_connect_:
		PDL_CallJS("event_connect", payload, 5);
		break;
	case event_nick_:
		PDL_CallJS("event_nick", payload, 4);
		break;
	case event_quit_:
		PDL_CallJS("event_quit", payload, 4);
		break;
	case event_join_:
		PDL_CallJS("event_join", payload, 4);
		break;
	case event_part_:
		PDL_CallJS("event_part", payload, 4);
		break;
	case event_mode_:
		PDL_CallJS("event_mode", payload, 4);
		break;
	case event_umode_:
		PDL_CallJS("event_umode", payload, 4);
		break;
	case event_topic_:
		PDL_CallJS("event_topic", payload, 4);
		break;
	case event_kick_:
		PDL_CallJS("event_kick", payload, 4);
		break;
	case event_channel_:
		PDL_CallJS("event_channel", payload, 4);
		break;
	case event_privmsg_:
		PDL_CallJS("event_privmsg", payload, 4);
		break;
	case event_notice_:
		PDL_CallJS("event_notice", payload, 4);
		break;
	case event_channel_notice_:
		PDL_CallJS("event_channel_notice", payload, 4);
		break;
	case event_invite_:
		PDL_CallJS("event_invite", payload, 4);
		break;
	case event_ctcp_req_:
		PDL_CallJS("event_ctcp_req", payload, 4);
		break;
	case event_ctcp_rep_:
		PDL_CallJS("event_ctcp_rep", payload, 4);
		break;
	case event_ctcp_action_:
		PDL_CallJS("event_ctcp_action", payload, 4);
		break;
	case event_unknown_:
		PDL_CallJS("event_unknown", payload, 4);
		if (strcmp(event, "PONG") == 0) {
			struct timeb pong;
			ftime(&pong);
			long rtt = (pong.time * 1000 + pong.millitm) - (client->ping.time
					* 1000 + client->ping.millitm);
			int len = 0;
			char *rtt_string = 0;
			len = asprintf(&rtt_string, "%ld", rtt);
			payload[1] = rtt_string;
			PDL_CallJS("event_rtt", payload, 2);
			if (rtt_string)
				free(rtt_string);
			pthread_mutex_unlock(&client->ping_mutex);
		}
		break;
	case event_numeric_:
		PDL_CallJS("event_numeric", payload, 4);
		break;
	}

	if (parms)
		free(parms);
	if (id)
		free(id);

}

void handle_event_connect(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);

	client->realServer = strdup(origin);

	//syslog(LOG_INFO, "Connection established");
	process_event(session, event, origin, params, count, event_connect_);

}

void handle_event_nick(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_nick_);
}

void handle_event_quit(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_quit_);
}

void handle_event_join(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_join_);
}

void handle_event_part(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_part_);
}

void handle_event_mode(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_mode_);
}

void handle_event_umode(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_umode_);
}

void handle_event_topic(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_topic_);
}

void handle_event_kick(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_kick_);
}

void handle_event_channel(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_channel_);
}

void handle_event_privmsg(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_privmsg_);
}

void handle_event_notice(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_notice_);
}

void handle_event_channel_notice(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_channel_notice_);
}

void handle_event_invite(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_invite_);
}

void handle_event_ctcp_req(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_ctcp_req_);
}

void handle_event_ctcp_rep(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_ctcp_rep_);
}

void handle_event_ctcp_action(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_ctcp_action_);
}

void handle_event_unknown(irc_session_t * session, const char * event,
		const char * origin, const char ** params, unsigned int count) {
	process_event(session, event, origin, params, count, event_unknown_);
}

void handle_event_numeric(irc_session_t * session, unsigned int event,
		const char * origin, const char ** params, unsigned int count) {
	char buf[24];
	sprintf(buf, "%d", event);
	process_event(session, buf, origin, params, count, event_numeric_);
}

void handle_event_dcc_chat_req(irc_session_t * session, const char * nick,
		const char * address, irc_dcc_t dcc_id) {

	//syslog(LOG_INFO, "handle_event_dcc_chat_req: %s %s %u", nick, address, dcc_id);

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);

	char *id = 0, *dcc_id_s = 0;

	asprintf(&id, "%d", client->id);
	asprintf(&dcc_id_s, "%u", dcc_id);

	const char *payload[4];
	payload[0] = id;
	payload[1] = nick;
	payload[2] = address;
	payload[3] = dcc_id_s;

	PDL_CallJS("event_dcc_chat_req", payload, 4);

	if (id)
		free(id);
	if (dcc_id_s)
		free(dcc_id_s);

}

void handle_event_dcc_send_req(irc_session_t * session, const char * nick,
		const char * address, const char * filename, int size, irc_dcc_t dcc_id) {

	//syslog(LOG_INFO, "handle_event_dcc_send_req: %s %s %s %u %u", nick, address, filename, size, dcc_id);

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);

	char *id = 0, *size_s = 0, *dcc_id_s = 0;

	asprintf(&id, "%d", client->id);
	asprintf(&size_s, "%u", size);
	asprintf(&dcc_id_s, "%u", dcc_id);

	const char *payload[6];
	payload[0] = id;
	payload[1] = nick;
	payload[2] = address;
	payload[3] = filename;
	payload[4] = size_s;
	payload[5] = dcc_id_s;

	PDL_CallJS("event_dcc_send_req", payload, 6);

	if (id)
		free(id);
	if (size_s)
		free(size_s);
	if (dcc_id_s)
		free(dcc_id_s);

}

void handle_dcc_chat_callback(irc_session_t * session, irc_dcc_t dcc_id,
		int status, void * ctx, const char * data, unsigned int length) {

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);

	//syslog(LOG_INFO, "%d %d %d %s", client->id, status, length, data);

	char *id = 0, *status_s = 0, *dcc_id_s = 0, *length_s = 0, *data_s = 0;

	asprintf(&id, "%d", client->id);
	asprintf(&dcc_id_s, "%u", dcc_id);
	asprintf(&status_s, "%d", status);
	asprintf(&length_s, "%u", length);
	asprintf(&data_s, "%s", data);

	const char *payload[5];
	payload[0] = id;
	payload[1] = dcc_id_s;
	payload[2] = status_s;
	payload[3] = length_s;
	payload[4] = data_s;

	PDL_CallJS("handle_dcc_callback", payload, 5);

	if (id)
		free(id);
	if (status_s)
		free(status_s);
	if (dcc_id_s)
		free(dcc_id_s);
	if (length_s)
		free(length_s);
	if (data_s)
		free(data_s);
}

void handle_dcc_send_callback(irc_session_t * session, irc_dcc_t dcc_id,
		int status, void * ctx, const char * data, unsigned int length) {

	//syslog(LOG_INFO, "%d %d %s", status, length, data);

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);
	dcc_send_t *dccInfo = (dcc_send_t*)ctx;

	int oldProgress = dccInfo->progress;

	dccInfo->bitsIn += length;
	dccInfo->progress = dccInfo->bitsIn / dccInfo->size;

	if (length > 0)
		fwrite(data, length, 1, dccInfo->file);
	else {
		fclose(dccInfo->file);
		free(dccInfo);
	}

	if (dccInfo->progress > oldProgress) {
		char *id = 0, *status_s = 0, *dcc_id_s = 0, *length_s = 0, *data_s = 0;

		asprintf(&id, "%d", client->id);
		asprintf(&dcc_id_s, "%u", dcc_id);
		asprintf(&status_s, "%d", status);
		asprintf(&length_s, "%u", length);
		asprintf(&data_s, "%d", (data == 0) ? 0 : 1);

		const char *payload[5];
		payload[0] = id;
		payload[1] = dcc_id_s;
		payload[2] = status_s;
		payload[3] = length_s;
		payload[4] = data_s;

		PDL_CallJS("handle_dcc_callback", payload, 5);

		if (id)
			free(id);
		if (status_s)
			free(status_s);
		if (dcc_id_s)
			free(dcc_id_s);
		if (length_s)
			free(length_s);
		if (data_s)
			free(data_s);
	}

}

void handle_dcc_sendfile_callback(irc_session_t * session, irc_dcc_t dcc_id,
		int status, void * ctx, const char * data, unsigned int length) {

	wIRCd_client_t *client = (wIRCd_client_t*) irc_get_ctx(session);

	//syslog(LOG_INFO, "%d %d %d %s", client->id, status, length, data);

	/*char *id = 0, *status_s = 0, *dcc_id_s = 0, *length_s = 0, *data_s = 0;

	asprintf(&id, "%d", client->id);
	asprintf(&dcc_id_s, "%u", dcc_id);
	asprintf(&status_s, "%d", status);
	asprintf(&length_s, "%u", length);
	asprintf(&data_s, "%d", (data == 0) ? 0 : 1);

	const char *payload[5];
	payload[0] = id;
	payload[1] = dcc_id_s;
	payload[2] = status_s;
	payload[3] = length_s;
	payload[4] = data_s;

	PDL_CallJS("handle_dcc_callback", payload, 5);

	if (id)
		free(id);
	if (status_s)
		free(status_s);
	if (dcc_id_s)
		free(dcc_id_s);
	if (length_s)
		free(length_s);
	if (data_s)
		free(data_s);*/
}

void setup_event_callbacks() {

	memset(&callbacks, 0, sizeof(callbacks));
	callbacks.event_connect = handle_event_connect;
	callbacks.event_nick = handle_event_nick;
	callbacks.event_quit = handle_event_quit;
	callbacks.event_join = handle_event_join;
	callbacks.event_part = handle_event_part;
	callbacks.event_mode = handle_event_mode;
	callbacks.event_umode = handle_event_umode;
	callbacks.event_topic = handle_event_topic;
	callbacks.event_kick = handle_event_kick;
	callbacks.event_channel = handle_event_channel;
	callbacks.event_privmsg = handle_event_privmsg;
	callbacks.event_notice = handle_event_notice;
	callbacks.event_channel_notice = handle_event_channel_notice;
	callbacks.event_invite = handle_event_invite;
	callbacks.event_ctcp_req = handle_event_ctcp_req;
	callbacks.event_ctcp_rep = handle_event_ctcp_rep;
	callbacks.event_ctcp_action = handle_event_ctcp_action;
	callbacks.event_unknown = handle_event_unknown;
	callbacks.event_numeric = handle_event_numeric;
	callbacks.event_dcc_chat_req = handle_event_dcc_chat_req;
	callbacks.event_dcc_send_req = handle_event_dcc_send_req;

}
