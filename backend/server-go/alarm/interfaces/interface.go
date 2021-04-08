package interfaces

type Alarm interface {
	 SendTo(receiver, message string) error
}
