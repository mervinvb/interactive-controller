extends Node

var ws = null
var _write_mode = WebSocketPeer.WRITE_MODE_TEXT
var current_question = "Je bent verbonden!"
var question = 0
var yes_count = 0
var no_count = 0

func _ready():
	ws = WebSocketClient.new()
	ws.connect("connection_established", self, "_connection_established")
	ws.connect("connection_closed", self, "_connection_closed")
	ws.connect("connection_error", self, "_connection_error")

	var url = "ws://localhost:8008"
	print("Connecting to " + url)
	ws.connect_to_url(url)

func _connection_established(protocol):
	ws.get_peer(1).set_write_mode(_write_mode)
	send_data("I am host")
	print("Connection established with protocol: ", protocol)

func _connection_closed():
	print("Connection closed")

func _connection_error():
	print("Connection error")
	
func _process(delta):
	if ws.get_connection_status() == ws.CONNECTION_CONNECTING || ws.get_connection_status() == ws.CONNECTION_CONNECTED:
		ws.poll()

	if ws.get_peer(1).is_connected_to_host():

		if ws.get_peer(1).get_available_packet_count() > 0 :
			var packet = ws.get_peer(1).get_packet()
			var text = packet.get_string_from_utf8()
			process_data(text)
			
	if Input.is_action_just_pressed("ui_accept"):
		question()

func resend_question():
	send_data(current_question)

func question():
	match question:
		0:
			current_question = "Moet de bruiloft verstoort worden?"
			$Label.text = current_question
			question += 1
			send_data(current_question)
		1:
			current_question = "Moet Chris nu de rauwe vis opeten?"
			$Label.text = current_question
			question += 1
			send_data(current_question)
		2:
			current_question = "Vinden jullie dit een leuke voorstelling?"
			$Label.text = current_question
			question += 1
			send_data(current_question)
		3:
			current_question = "Is Jippe er vandaag wel?"
			$Label.text = current_question
			question += 1
			send_data(current_question)

func process_data(data):
	print(data)
	if "Count" in data:
		var data_split = data.split(",", true, 0)
		yes_count = int(data_split[1])
		no_count = int(data_split[2])
		$Yes_count.text = str(yes_count)
		$No_count.text = str(no_count)
	if "Resend" in data:
		resend_question()

func send_data(data):
	ws.get_peer(1).set_write_mode(_write_mode)
	ws.get_peer(1).put_packet(encode_data(data, _write_mode))


func set_write_mode(mode):
	_write_mode = mode

func encode_data(data, mode):
	if mode == WebSocketPeer.WRITE_MODE_TEXT:
		return data.to_utf8()
	return var2bytes(data)

func decode_data(data, is_string):
	if is_string:
		return data.get_string_from_utf8()
	return bytes2var(data)


func _on_Timer_timeout():
	send_data("Count")
